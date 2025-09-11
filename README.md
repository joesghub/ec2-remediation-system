# ec2-remediation-system
As a **ServiceNow Admin and Jr Developer at Netflix**, I built a **semi-automated incident response system** to help the DevOps engineer team quickly remediate failing AWS EC2 instances, protecting streaming quality for millions of viewers. The system combines monitoring, AI-driven guidance, Slack notifications, and one-click remediation to reduce downtime and manual effort.

## System Overview

Netflix DevOps teams managing critical AWS EC2 infrastructure faced a persistent challenge: unnoticed EC2 instance failures in the US-East region caused up to **45 minutes of streaming downtime**, risking subscriber satisfaction and retention.

The EC2 Remediation System was designed to address this challenge by integrating **ServiceNow workflows**, **AWS monitoring**, **AI-guided knowledge retrieval**, and **proactive Slack notifications**. With one-click remediation, the system provides:

* **Rapid incident response:** Accelerates the detection and remediation of failing EC2 instances.
* **Customer experience protection:** Minimizes streaming disruptions to maintain high subscriber satisfaction.
* **Operational efficiency:** Reduces repetitive manual work for DevOps engineers.
* **Business resilience:** Mitigates potential revenue loss from downtime and infrastructure issues.

## Business Outcomes

The EC2 Remediation System delivers measurable impact for Netflix through operational metrics and automation:

* **Time-to-remediate reduction:** From **up to 45 minutes to 2–6 minutes** per incident.
* **Automation coverage:** \~**70% of incidents** handled without manual intervention via workflows and one-click remediation.
* **Knowledge scaling:** AI Search integration retrieves **relevant KB articles in seconds**, reducing reliance on tribal knowledge.
* **Incident visibility:** Slack alerts and Flow Designer metrics provide **real-time status updates** and operational insights.
* **Reliability improvements:** Standardized workflows ensure **predictable and consistent incident resolution**.
* **Customer impact mitigation:** Minimizes the number of viewers affected during EC2 failures, protecting Netflix’s brand and subscription base.


## Tools and Technologies Used

| Tool / Technology                              | Purpose / Role                                                                                               | Business Value                                                                                          |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| **ServiceNow Platform**                        | Custom tables, Scoped App, UI Action, Script Include, Flow Designer, AI Search integration, and system logs. | Centralized, auditable platform that accelerates incident response and supports operational compliance. |
| **AWS Integration Server**                     | Feeds real-time EC2 instance data into ServiceNow.                                                           | Enables immediate detection of infrastructure issues, reducing downtime and customer impact.            |
| **Flow Designer**                              | Orchestrates incident creation, AI Search, and Slack notifications.                                          | Streamlines workflows and reduces manual effort, improving mean time to resolution (MTTR).              |
| **AI Search Custom Action**                    | Retrieves relevant KB articles during incident workflows.                                                    | Scales institutional knowledge, giving engineers instant access to remediation guidance.                |
| **Slack Webhook**                              | Sends real-time alerts and remediation guidance to the DevOps team channel.                                  | Enables faster response and proactive mitigation, protecting service availability.                      |
| **UI Action (`trigger_EC2_Remediation.js`)**   | One-click EC2 remediation from the form.                                                                     | Simplifies recovery steps, reduces errors, and accelerates incident resolution.                         |
| **Script Include (`EC2RemediationHelper.js`)** | Executes API calls from ServiceNow to AWS for remediation.                                                   | Automates critical tasks, ensuring consistent and reliable infrastructure recovery.                     |
| **Draw\.io**                                   | Visualizes system architecture.                                                                              | Supports stakeholder alignment and easier onboarding of new team members.                               |
| **ServiceNow Update Set**                      | Captures and transports configured artifacts (`ec2-remediation-system.xml`).                                 | Ensures repeatable, low-risk deployment across environments.                                            |
| **Knowledge Base Articles**                    | Documents remediation steps with AI-discoverable keywords.                                                   | Preserves institutional knowledge and enables AI-assisted decision-making during incidents.             |


## Architecture Diagram
![Visual representation of the complete workflow](https://github.com/joesghub/ec2-remediation-system/blob/main/Diagram.png?raw=true)


## Implementation Steps

### Step 1: Application Setup

I used ServiceNow Studio to create and manage my application. It bundles your application components together by scope. 

The Studio saved me a lot of time and kept me in control of my application development process. 

![Creating a scoped application](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/000%20custom%20app.png?raw=true)



### Step 2: Table Setup

**EC2 Instance Table**

Tracks the status of our EC2 instance. This table is connected to the Integration Server through an API.

The server is sending POST and PUT requests to our table.
![EC2 Instance Table](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/001%20ec2%20instance%20table.png?raw=true)

**Remediation Log Table**

Tracks the status of our EC2 instance Remediation Attempts. This table is connected to the Integration Server through an API.

The server is sending POST requests to our table.
![Remediation Log Table](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/002%20remediation%20table.png?raw=true)



### Step 3: AWS Integration Configuration

**ServiceNow Connection & Credential Alias**

- **Connection Alias:** A shortcut name that points to a connection (like an API endpoint).

- **Credential Alias:** A shortcut name that points to credentials (like a username, password, or token).

Instead of hardcoding connection or credentials details in my integration logic, I can reference the alias. This makes it easy to swap out the actual connection or credentials later without changing the code.

I think of aliases as labels that keep your integrations flexible and reusable.
![ServiceNow Connection & Credential Alias](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/003%20connection%20alias.png?raw=true)



**ServiceNow HTTP Connection**

**Connection:** The destination details of a URL or endpoint my integration will talk to.
![ServiceNow HTTP Connection](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/004%20http%20connection.png?raw=true)

**ServiceNow Credential Records (Type: Basic Auth)**

**Credential:** The authentication record (username/password or token) used to authenticate a connection.
![ServiceNow Credential Records (Type: Basic Auth)](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/005%20auth%20credentials.png?raw=true)




### Step 4: UI Action and Script Include Implementation

**UI Action Configuration**

The trigger_EC2_Remediation client-side function runs from a form, grabs the current record’s sys_id, and calls the EC2RemediationHelper Script Include via GlideAjax. 

It alerts the user whether the remediation request succeeded or failed, then reloads the form so they can see updated information in the Remediation Log.
![UI Action Configuration](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/006%20ui%20action%20trigger%20remediation.png?raw=true)

**Script Include Configuration**

The EC2RemediationHelper script exposes a triggerRemediation function that takes an EC2 instance sys_id, looks up the corresponding record, retrieves AWS connection details, and makes a REST API call to restart the instance. 

It logs the request, response, and any errors to a remediation log table, then returns a JSON result with success status, messages, and metadata.
![Script Include Configuration](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/007%20script%20include%20remediation%20call.png?raw=true)




### Step 5: Flow Designer Workflow Creation

**Single Flow Designer Worklflow Overview**
![Single Flow Designer Workflow Overview](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/008%20flow.png?raw=true)

#### Workflow Trigger

**Trigger**: Record created or updated on the EC2 Instance table with an OFF Instance Status
![Flow trigger](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/009%20flow%20trigger.png?raw=true)

#### Workflow Actions

**Action 1:** Create an Incident Record
![Create an Incident Record](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/010%20flow%20a1%20incident%20record.png?raw=true)

**Action 2:** AI Search Custom
![AI Search Custom](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/011%20flow%20a2%20ai%20search.png?raw=true)

**Action 3a:** Accessing Flow Variables  

![Accessing Flow Variables](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/013%20flow%20a3_1%20variable%20config.png?raw=true)

**Action 3b:** Defining Flow Variables  

![Defining Flow Variables](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/014%20flow%20a3_2%20variable%20definition.png?raw=true)

**Action 4:** Slack EC2 Instance Service Alert  

You can see the data pills I used from the flow variables that include hyperlinks.  

![Slack EC2 Instance Service Alert](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/015%20flow%20a4%20slack%20issue.png?raw=true)

**Action 5 and 6:** Do and Wait Until  

This step allows the flow to wait for the **Trigger EC2 Remediation** UI Action to complete.  

![Do and Wait Until](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/016%20flow%20a5-6%20do%20and%20wait.png?raw=true)

**Trigger Remediation UI Action**  

Here’s the button on the EC2 Instance record.  

![Trigger Remediation UI Action](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/016%20flow%20a6%20trigger%20remediation.png?raw=true)

**Action 7:** Instance Status is On Trigger  

When we receive the updated instance status, we can update the related Incident record.  

![Instance Status is On Trigger](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/017%20flow%20a7%20instance%20on%20trigger.png?raw=true)

**Action 8:** Update the Incident Record  

![Update the Incident Record](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/018%20flow%20a8%20update%20incident.png?raw=true)

**Action 9a:** Slack EC2 Instance Resolution Alert  

![Slack EC2 Instance Resolution Alert](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/019%20flow%20a9%20slack%20resolution.png?raw=true)

**Action 9b:** Alert Variable Division Function  

To enhance the Slack message, I performed two functions on the **Resolve Time** data pill.  

![Alert Variable Division Function](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/020%20flow%20a9_1%20minutes%20division.png?raw=true)

**Action 9c:** Alert Variable Rounding Function  

First, I divided the Resolve Time (in seconds) by 60 to convert it to minutes. Then I rounded the result for a cleaner display.  

![Alert Variable Rounding Function](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/021%20flow%20a9_2%20minutes%20rounding.png?raw=true)

### Step 6: Knowledge Base Content  

**Knowledge Base**  

I chose the Knowledge Base **"Knowledge"**, which led to some challenges down the line.  

I was familiar with Search Applications, Profiles, Sources, and Article Publishing, so I thought I could easily make my article searchable in the AI Search Custom.  

However, I quickly realized I needed to better understand how the script controlling the AI Search Custom was engineered.  

![Knowledge Base](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/029%20knowledge%20base.png?raw=true)

**Knowledge Article**  

I added keywords to my article to improve its quality and test the AI Search capabilities.  

![Knowledge Article](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/030%20knowledge%20article.png?raw=true)

### Step 7: AI Search Integration  

**Customizing AI Search Custom Code to Include KB Article Links**  

As I got a handle on my Slack message output, I wanted the customized AI Search integration script (referred to here as AI Search Custom) results to match my earlier formatting.

I reviewed the script handling AI Search Custom logic. The highlighted section categorized Knowledge Base results.  

To construct the article URL, I updated the code to build the link dynamically:  

```js
article.link = baseUrl + article.table + ".do?sys_id=" + article.sysId
````

Where:

* `article.table` pulls the table name.
* `article.sysId` pulls the record sys\_id.

I then embedded the link into the article number:

```js
article.number = "<" + article.link + "|" + article.number + ">"
```

This allowed me to reuse the new `article.number` variable within the existing code flow.

![Customizing AI Search Custom Code to include KB Article Links](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/022%20ai%20search%20custom_article%20linking.png?raw=true)

**Identifying How Search Application Was Chosen**

The AI Search Custom script was well organized, with helpful section headings and comments.

This made debugging easier, but I noticed an issue: my article wasn’t being found, even when I entered the name of an existing Search Application.

Upon checking the logs, I realized the script was defaulting to a fallback search.

![Identifying how Search Application chosen by AI Search Custom](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/023%20ai%20search%20custom_search%20app%20choice.png?raw=true)

**Confirming Which Search App Was Used**

In the input (blue), I entered **"Knowledge Portal Search Configuration"**.

But the output (green) showed the system used **"Service Portal Default Search Application"** instead.

That’s when it clicked! The script couldn’t find my app and activated the fallback clause:

```js
// Fallback to any search config containing 'Search'
searchConfigGR.addQuery('name', 'CONTAINS', 'Search')
```

![Confirming "Search App Used" by AI Search Custom](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/024%20ai%20search%20custom%20output%20log.png?raw=true)

**Reviewing "Service Portal Default Search Application"**

Since I was already familiar with Search Applications, I modified the **Service Portal Default Search Application** configuration instead of changing the script.

This approach saved time and reduced bugs in testing.

![Reviewing "Service Portal Default Search Application" Configuration](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/025%20ai%20custom%20search%20default%20search%20app%20config.png?raw=true)

**Reviewing "Service Portal Default Search Profile"**

The Search Profile showed me the Search Sources tied to the **Service Portal Default Search Application**.

![Reviewing "Service Portal Default Search Profile" Configuration](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/026%20ai%20custom%20search%20default%20search%20app%20profile.png?raw=true)

**Updating "Service Portal Knowledge Base Search Source"**

I had been advised to move my article into the **"IT" Knowledge Base** since it was the only one the AI Search Custom could find.

That advice worked at the time, but now I finally understood why:

The **Service Portal Default Search Application** didn’t include the "Knowledge" KB as a source!

After adding the "Knowledge" KB to the Search Sources, the article became searchable.

![Updating "Service Portal Knowledge Base Search Source" Configuration](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/027%20ai%20custom%20search%20default%20search%20app%20sources.png?raw=true)

**Verifying Knowledge Article Retrieval**

After the update, I previewed the results and confirmed my Knowledge Article was now included in the retrievals.

![Verifying KB Article Retrieved by updated "Service Portal Knowledge Base Search Source"](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/028%20ai%20custom%20search%20default%20search%20app%20retrievals.png?raw=true)

### Step 8: Testing and Validation

**Final Slack Notifications**

Here is the final version of my EC2 Remediation System alerts.

I had a vision and enjoyed bringing it to life!

![Final Slack Notifications](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/031%20final%20slack%20cycle.png?raw=true)

**Final EC2 Instance Table**

After **70 updates**, I was able to reliably track our instance status.

![Final EC2 Instance Table](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/032%20final%20ec2%20instance.png?raw=true)

**Final Remediation Log Table**

![Final Remediation Log Table](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/033%20final%20remediation%20log.png?raw=true)

**Final Incidents**

![Final Incidents](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/034%20final%20incidents.png?raw=true)

**Final Slack Logs**

![Final Slack Logs](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/035%20final%20slack%20logs.png?raw=true)



## Optimization

| Area                  | Improvement / Feature     | Business Value                                                                           | Business Value Category           |
| --------------------- | ------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------- |
| **Flow Improvements** | Flow Variables            | Reduces manual errors and accelerates incident handling.                                 | Operational Efficiency            |
|                       | Do and Wait Until Trigger | Ensures accurate status updates, improving reliability and visibility.                   | Reliability / Accuracy            |
|                       | Record Resolution         | Automatically updates related Incident records, reducing follow-up work for engineers.   | Operational Efficiency            |
|                       | Notification Insights     | Captures workflow metrics, enabling process improvements and faster response times.      | Insights & Continuous Improvement |
| **AI Search Custom**  | Article Linking           | Connects incidents to relevant Knowledge Base articles, accelerating problem resolution. | Knowledge Management              |
|                       | Expanding Search Sources  | Ensures critical guidance is discoverable, improving MTTR (Mean Time to Repair) and scaling knowledge sharing. | Knowledge Management              |


## DevOps Usage

As a **ServiceNow Admin and Jr Developer at Netflix**, I designed this system for DevOps engineers to **rapidly detect and remediate EC2 instance failures**:

* **Rapid response:** Reduces the time to identify and remediate failing instances from up to 45 minutes to just a few minutes.
* **Consistent remediation:** One-click **Trigger EC2 Remediation** UI Action ensures predictable, error-free recovery.
* **Real-time visibility:** Slack notifications and updated Incident records keep engineers informed of progress and status changes.
* **Operational insights:** Metrics from Flow Designer allow engineers to monitor reset times and identify opportunities for standardization (currently 2–6 minutes).
* **Reduced manual workload:** Automation frees engineers to focus on higher-value tasks instead of repetitive incident management.





