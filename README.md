# ec2-remediation-system
Semi-automated ServiceNow incident response system that helps the DevOps engineer team quickly remediate failing AWS EC2 instances

## System Overview
Description of the EC2 remediation system for DevOps teams

## Implementation Steps
Key configuration decisions and integration points



Script Include Configuration:
Navigate to: System Definition > Script Includes
Name: EC2RemediationHelper
API Name: x_snc_ec2_monito_0.EC2RemediationHelper (auto-generated in scope)
Accessible from: This application scope only
Glide AJAX enabled: Checked
Active: Checked

Chose x_snc_ec2_monito_0.user as the role to base the ACL on for the Script Include.
When creating a client-callable script include in ServiceNow, the system prompts for a user role for access control. This is a security measure to ensure that only authorized users can execute the script include from client-side scripts.


## Architecture Diagram
![Visual representation of the complete workflow](https://github.com/joesghub/ec2-remediation-system/blob/main/Diagram.png?raw=true)


## Optimization
How you improved the system for efficiency and reliability


## DevOps Usage
Instructions for Netflix DevOps engineers on using the remediation system
