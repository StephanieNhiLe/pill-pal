# PillPal AI  

## Inspiration
Health disparities among racial and ethnic minorities significantly impact medication adherence and overall health outcomes. [A 2024 report by the Kaiser Family Foundation](https://www.kff.org/racial-equity-and-health-policy/issue-brief/how-present-day-health-disparities-for-black-people-are-linked-to-past-policies-and-events/) found that Black and Hispanic adults are less likely to report taking their medications as prescribed compared to white adults. This lack of adherence can be attributed to several contributing factors, including language barriers, complex medication regimens, limited access to healthcare resources such as geographic, financial, and systemic barriers can restrict access to necessary healthcare services and information.

Moreover, experiences of discrimination contribute to a lack of trust in healthcare systems. For instance, 18% of Black adults report that healthcare providers or their staff have treated them unfairly or with disrespect due to their race or ethnic background, while only 3% of white adults report similar experiences. This significant disparity underscores the challenges faced by minority patients in seeking equitable healthcare.

PillPal aims to address these disparities by providing a culturally sensitive and accessible medication management app designed to empower individuals, particularly those in marginalized communities, to manage their medications effectively. By fostering independence and enhancing health outcomes, PillPal strives to create a supportive environment where all individuals can engage with their health care proactively and confidently.

## What it does
PillPal is an AI-powered mobile application specifically designed to assist key target audiences in managing their medications. These audiences include:
- **Elderly individuals, particularly within racial and ethnic minority communities**, who may struggle with complex medication regimens and limited access to healthcare.
- **Patients with chronic illnesses**, such as diabetes or hypertension, who need help adhering to daily or long-term medication schedules.
- **Caregivers and family members** responsible for helping others manage their medications, ensuring support and monitoring of loved ones.
- **Low-income and underserved communities**, where financial or geographic barriers may prevent access to healthcare resources, making medication management difficult.
- **Immigrants and Non-English speaking users**, especially within immigrant communities, who may face language barriers in understanding prescriptions and instructions.

Its key features include:
- **Prescription and Pill Identification**: Users can upload photos of prescriptions or pills. The app utilizes AI to engage in a conversational interface, providing answers to user queries and suggesting actionable steps based on their needs.
- **Personalized Medication Log**: The app allows users to easily add medications to their log through the conversational interface. PillPal suggests actions such as scheduling intake times or researching additional medication information, making medication management straightforward and intuitive.
- **Calendar Tracker**: Users can access a clear calendar that tracks their medication intake schedule. The app allows users to set reminders, ensuring they stay on track with their medication regimen.
- **Emergency Contact**: PillPal plans to include a feature allowing users to share their medication profile with a designated contact. This will enable the contact to monitor the user's medication status and provide support when needed.

## How we built it
![](/frontend/PillPalAI-techmap.jpg)

PillPal was developed with the primary goal of empowering elderly individuals to manage their medications effectively. At the core of our app is a robust AI framework utilizing **LangChain** and **OpenAI**, which allows us to:

- Engage users through a conversational interface for personalized medication management.
- Identify pills and prescriptions from user-uploaded photos, providing real-time information and guidance.
- Suggest actionable steps based on user inquiries, such as adding medications to logs or scheduling reminders.

To ensure efficient data retrieval and a seamless user experience, we integrated **fastAPI** with **PineCone** for indexing and querying medication information. Our choice of **React Native** allowed us to create a responsive mobile application that works smoothly on both Android and iOS platforms.

We also placed a strong emphasis on **user experience (UX)** design to ensure that our app is accessible to users, especially those with limited technological proficiency. By focusing on simplicity and ease of use, we aimed to make PillPal a valuable tool for anyone managing their health.

##Challenges we ran into
During the development of PillPal, we faced several challenges:
- **Indexing System Setup**: Properly configuring the indexing system for efficient data retrieval proved to be a complex task, requiring extensive testing and optimization to ensure fast and accurate responses.
- **Integration for Real-Time Responses**: Ensuring smooth integration of various components for real-time user interactions was challenging. We had to address latency issues and maintain a seamless user experience.
- **Tracking System Development**: Designing a reliable and user-friendly tracking system for medication intake logs posed various challenges, including ensuring data accuracy and ease of use for elderly individuals.

## Accomplishments that we're proud of
Throughout the development process, we achieved several milestones that we are particularly proud of:
- **AI-Powered Chat System**: We successfully implemented an AI-powered chat system that provides immediate assistance and efficient medication management, enhancing user experience.
- **Robust Medication Log Feature**: Establishing a comprehensive medication log feature allows users to keep detailed records of their prescriptions and intake schedules, improving adherence.
- **Positive User Feedback**: Initial user testing yielded overwhelmingly positive feedback, indicating a strong interest and critical need for such a tool within our target communities.

##What we learned
Our journey in developing PillPal has taught us valuable lessons:
- **User-Centric Design**: Prioritizing user-centric design is crucial when developing features that cater specifically to the needs of elderly individuals and communities of color.
- **Technology Integration Challenges**: The complexity of integrating various AI technologies highlighted the necessity of thorough testing and iteration to ensure optimal functionality and user satisfaction.
- **Collaboration with Health Professionals**: Working closely with healthcare professionals provided us with essential insights into effective medication management practices and the specific needs of our target audience.

## What's next for PillPal
Looking ahead, we have several strategic goals for PillPal:
- **Feature Expansion**: We plan to explore additional features, including multilingual support and access to community resources, to further assist our users in navigating their healthcare.
- **Partnership Development**: Seeking partnerships with healthcare providers and community organizations is essential for promoting PillPal and ensuring it reaches those who need it most.
- **User Education**: Developing educational resources within the app will empower users with knowledge about their medications and overall health management, fostering a sense of independence and confidence in their healthcare decisions.