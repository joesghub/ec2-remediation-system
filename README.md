# ec2-remediation-system
I built a semi-automated incident response system on ServiceNow, designed for DevOps teams managing critical AWS EC2 infrastructure at Netflix. It ensures rapid detection and remediation of failing EC2 instances, minimizing viewer impact and reducing manual intervention.

## System Overview
AWS EC2 instance failures in the US-East region previously went unnoticed for up to 45 minutes. This caused streaming disruptions and potential subscriber churn. 

This system integrates monitoring, AI-powered guidance, Slack notifications, and a one-click remediation within ServiceNow to solve that problem.


| Tool / Technology                              | Purpose / Role                                                                                                                                                    |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ServiceNow Platform**                        | Foundation for implementation—includes custom tables, Scoped App, UI Action, Script Include, Flow Designer, AI Search integration, and system logs.  |
| **AWS Integration Server**                     | External monitoring system feeding real-time EC2 instance data into ServiceNow.                                                                      |
| **Flow Designer**                              | Orchestrates incident creation, AI Search execution, and Slack notification.                                                                         |
| **AI Search Custom Action**                    | Retrieves relevant knowledge base articles during incident workflow.                                                                                 |
| **Slack Webhook**                              | Delivers remediation guidance to the DevOps team channel—used by the workflow to notify engineers.                                                   |
| **UI Action (`trigger_EC2_Remediation.js`)**   | Adds a button for one-click EC2 remediation form action.                                                                                             |
| **Script Include (`EC2RemediationHelper.js`)** | Handles API calls from ServiceNow to the AWS Integration Server for remediation.                                                                     |
| **Draw\.io**                                   | Used for creating the system architecture diagram (`Diagram.png`).                                                                                   |
| **ServiceNow Update Set**                      | `ec2-remediation-system.xml` package to capture and transport configured artifacts.                                                                  |
| **Knowledge Base Articles**                    | Document remediation process ("Run the UI Action...") tagged with keywords for AI discoverability.                                                   |


## Implementation Steps
Key configuration decisions and integration points



### Step 1: Application Setup

I used ServiceNow Studio to create and manage my application. It bundles your application components together by scope. Did I mention it has **tabs**?!

The Studio saved me a lot of time and kept me in control of my application development process. 

![Creating a scoped application](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/000%20custom%20app.png?raw=true)



### Step 2: Table Setup

**EC2 Instance Table**
![EC2 Instance Table](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/001%20ec2%20instance%20table.png?raw=true)

**Remediation Table**
![Remediation Table](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/002%20remediation%20table.png?raw=true)



### Step 3: AWS Integration Configuration

**ServiceNow Connection & Credential Alias**
![ServiceNow Connection & Credential Alias](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/003%20connection%20alias.png?raw=true)

**ServiceNow HTTP Connection**
![ServiceNow HTTP Connection](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/004%20http%20connection.png?raw=true)

**ServiceNow Credential Records (Type: Basic Auth)**
![ServiceNow Credential Records (Type: Basic Auth)](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/005%20auth%20credentials.png?raw=true)




### Step 4: UI Action and Script Include Implementation


**UI Action Configuration**
![UI Action Configuration](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/006%20ui%20action%20trigger%20remediation.png?raw=true)

**Script Include Configuration**
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

**Action 3:** Set Flow Variables
![](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/012%20flow%20a3%20set%20flow%20variables.png?raw=true)

**Action 3:** Accessing Flow Variables

![](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/013%20flow%20a3_1%20variable%20config.png?raw=true)

**Action 3:** Defining Flow Variables
![](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/014%20flow%20a3_2%20variable%20definition.png?raw=true)

**Action 4:** Slack EC2 Instance Service Alert
![](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/015%20flow%20a4%20slack%20issue.png?raw=true)

**Action 5 and 6:** Do and Wait
![](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/016%20flow%20a5-6%20do%20and%20wait.png?raw=true)

**Trigger Remediation UI Action**
![](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/016%20flow%20a6%20trigger%20remediation.png?raw=true)

**Action 7:** Instance Status is On Trigger
![](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/017%20flow%20a7%20instance%20on%20trigger.png?raw=true)

**Action 8:** Update the Incident Record
![](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/018%20flow%20a8%20update%20incident.png?raw=true)

**Action 9:** Slack EC2 Instance Resolution Alert
![](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/019%20flow%20a9%20slack%20resolution.png?raw=true)

**Action 9:** Alert Variable Division Function
![](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/020%20flow%20a9_1%20minutes%20division.png?raw=true)

**Action 9:** Alert Variable Rounding Function
![](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/021%20flow%20a9_2%20minutes%20rounding.png?raw=true)



### Step 6: AI Search Integration

**Customizing AI Search Custom Code to include KB Article Links**
![](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/022%20ai%20search%20custom_article%20linking.png?raw=true)

**Identifying how Search Application chosen by AI Search Custom**
![](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/023%20ai%20search%20custom_search%20app%20choice.png?raw=true)

**Confirming "Search App Used" by AI Search Custom**
![](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/024%20ai%20search%20custom%20output%20log.png?raw=true)

**Reviewing "Service Portal Default Search Application" Configuration**
![](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/025%20ai%20custom%20search%20default%20search%20app%20config.png?raw=true)

**Reviewing "Service Portal Default Search Profile" Configuration**
![](https://github.com/joesghub/ec2-remediation-system/blob/main/screenshots/026%20ai%20custom%20search%20default%20search%20app%20profile.png?raw=true)

****
![]()

****
![]()

****
![]()

****
![]()

****
![]()

****
![]()

****
![]()

****
![]()

****
![]()

****
![]()

****
![]()

****
![]()


























## Architecture Diagram
![Visual representation of the complete workflow](https://github.com/joesghub/ec2-remediation-system/blob/main/Diagram.png?raw=true)


## Optimization
How you improved the system for efficiency and reliability


## DevOps Usage
Instructions for Netflix DevOps engineers on using the remediation system
