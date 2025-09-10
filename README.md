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

## Architecture Diagram
![Visual representation of the complete workflow](https://github.com/joesghub/ec2-remediation-system/blob/main/Diagram.png?raw=true)


## Optimization
How you improved the system for efficiency and reliability


## DevOps Usage
Instructions for Netflix DevOps engineers on using the remediation system
