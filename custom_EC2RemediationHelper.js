(function execute(inputs, outputs) {
    try {
        // Get inputs from Script Step Input Variables
        var searchTerm = inputs.search_term;
        var logResults = inputs.enable_detailed_logging || false;
        var searchApp = inputs.search_app || "";
        
        gs.log("EC2 AI Search Script executing with search term: " + searchTerm + ", search app: " + searchApp);
        
        // Dynamic lookup of AI Search configuration IDs
        var searchConfigGR = new GlideRecord('sys_search_context_config');
        
        // If search app specified, try to find it by name
        if (searchApp && searchApp.trim() !== "") {
            searchConfigGR.addQuery('name', searchApp);
        } else {
            // Fallback to any search config containing 'Search'
            searchConfigGR.addQuery('name', 'CONTAINS', 'Search');
        }
        
        searchConfigGR.setLimit(1);
        searchConfigGR.query();
        
        var rpConfigGR = new GlideRecord('aisa_rp_config');  
        rpConfigGR.setLimit(1);
        rpConfigGR.query();
        
        if (searchConfigGR.next() && rpConfigGR.next()) {
            // Log which search app is being used
            var actualSearchApp = searchConfigGR.name.toString();
            gs.log("Using AI Search app: " + actualSearchApp);
            
            // Prepare AI Search data
            var data = {
                "rpSysId": rpConfigGR.sys_id.toString(),
                "searchContextConfigId": searchConfigGR.sys_id.toString(),
                "searchTerm": searchTerm
            };
            
            // Execute AI Search
            var searchUtil = new global.AISASearchUtil();
            var results = searchUtil.search(data);
            
            // Handle different result types (string or object)
            var parsedResults;
            if (typeof results === 'string') {
                parsedResults = JSON.parse(results);
            } else if (typeof results === 'object') {
                parsedResults = results;
            } else {
                parsedResults = null;
            }
            
            // Parse results to extract useful information
            var articleCount = "0";
            var articleTitles = "";
            var searchStatus = "success";
            var articlesForFlow = [];
            
            if (parsedResults && parsedResults.data && parsedResults.data.search && parsedResults.data.search.searchResults) {
                var searchResults = parsedResults.data.search.searchResults;
                articleCount = searchResults.length.toString();
                
                // Extract article info for Flow Designer
                var titles = [];
                for (var i = 0; i < searchResults.length; i++) {
                    if (searchResults[i].title) {
                        titles.push(searchResults[i].title);
                        
                        // Create clean article object for Flow Designer
                        var article = {
                            title: searchResults[i].title,
                            sysId: searchResults[i].sysId,
                            table: searchResults[i].table,
                            text: searchResults[i].text ? searchResults[i].text.substring(0, 200) : "",
                            number: "",
                            searchApp: actualSearchApp
                        };
                        
                        // Clean HTML tags from title and text
                        if (article.title) {
                            article.title = article.title.replace(/<[^>]*>/g, '');
                        }
                        if (article.text) {
                            article.text = article.text.replace(/<[^>]*>/g, '');
                        }
                        
                        // Extract KB number if available
                        if (searchResults[i].columns) {
                            for (var j = 0; j < searchResults[i].columns.length; j++) {
                                if (searchResults[i].columns[j].fieldName === 'number') {
                                    article.number = searchResults[i].columns[j].value;
                                    break;
                                }
                            }
                        }

                        articlesForFlow.push(article);
                    }
                }
                articleTitles = titles.join(", ");
                
                if (logResults) {
                    gs.log("AI Search SUCCESS: Found " + articleCount + " items using app: " + actualSearchApp);
                    gs.log("Article titles: " + articleTitles);
                }
            } else {
                if (logResults) {
                    gs.log("AI Search returned no results for app: " + actualSearchApp);
                }
            }
            
            // Build Slack-formatted message from the same data
            var slackMessage = "";
            if (articlesForFlow.length > 0) {
                slackMessage = "🔎 Issue Detected - Found " + articlesForFlow.length + " helpful items:\n\n";
                for (var i = 0; i < articlesForFlow.length; i++) {
                    var article = articlesForFlow[i];
                    
                    // Determine record type and format accordingly
                    var recordIcon = "📄";
                    var recordIdentifier = "";
                    
                    if (article.table === 'kb_knowledge' && article.number && article.number.trim() !== "") {
                        recordIcon = "📚"; // Knowledge base icon
                        // Add record URL (works for KB or any table)
                        var baseUrl = gs.getProperty('glide.servlet.uri');
                        if (article.sysId && article.table) {
                        article.link = baseUrl + article.table + ".do?sys_id=" + article.sysId;
                        // Embed link into KB number
                        article.number = "<" + article.link + "|" + article.number + ">";
                        }
                        recordIdentifier = article.number + ": ";
                    } else if (article.table === 'incident') {
                        recordIcon = "🎫"; // Incident icon
                        recordIdentifier = article.number ? article.number + ": " : "";
                    } else if (article.table === 'sc_cat_item' || article.table === 'sc_req_item') {
                        recordIcon = "🛒"; // Catalog item icon
                        recordIdentifier = "";
                    } else {
                        recordIcon = "📄"; // Generic document icon
                        recordIdentifier = article.number ? article.number + ": " : "";
                    }
                    
                    slackMessage += recordIcon + " " + recordIdentifier + article.title + "\n";
                    if (article.text && article.text.trim() !== "") {
                        slackMessage += "💡 " + article.text.substring(0, 100) + "...\n\n";
                    } else {
                        slackMessage += "\n";
                    }
                }
                slackMessage += "Search ServiceNow by KB number or title for full details.";
            } else {
                slackMessage = "🚨 Issue Detected - No knowledge items found for: " + searchTerm + "\n\nManual investigation required.";
            }
            
            // Set Script Step Output Variables
            outputs.status = searchStatus;
            outputs.count = articleCount;
            outputs.titles = articleTitles;
            outputs.articles = JSON.stringify(articlesForFlow);
            outputs.term_used = searchTerm;
            outputs.raw_results = typeof results === 'string' ? results : JSON.stringify(results);
            outputs.search_app_used = actualSearchApp;
            outputs.slack_message = slackMessage;
            
        } else {
            var errorMsg = "Could not find AI Search configuration";
            if (searchApp) {
                errorMsg += " for app: " + searchApp;
            }
            
            gs.log("ERROR: " + errorMsg);
            outputs.status = "config_error";
            outputs.count = "0";
            outputs.titles = errorMsg;
            outputs.articles = "[]";
            outputs.term_used = searchTerm;
            outputs.raw_results = "{}";
            outputs.search_app_used = searchApp || "unknown";
            outputs.slack_message = "🚨 EC2 Issue Detected - Configuration Error\n\n" + errorMsg + "\n\nPlease check AI Search setup.";
        }
        
    } catch (ex) {
        gs.log("EC2 AI Search Script ERROR: " + ex.message);
        outputs.status = "script_error";
        outputs.count = "0";
        outputs.titles = "Error: " + ex.message;
        outputs.articles = "[]";
        outputs.term_used = searchTerm || "unknown";
        outputs.raw_results = "{}";
        outputs.search_app_used = searchApp || "unknown";
        outputs.slack_message = "🚨 EC2 Issue Detected - Script Error\n\n" + ex.message + "\n\nPlease contact IT support.";
    }
})(inputs, outputs);