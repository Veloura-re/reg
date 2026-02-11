export const TEMPLATES = [
    {
        id: "received",
        trigger: "waiting", // Default state
        name: "Application Received",
        type: "Both",
        subject: "Safe Arrival: [Student Name]'s Enrollment Protocol",
        content: "Greetings [Parent Name],\n\nWe have successfully received the enrollment application for [Student Name] (Grade [Grade]).\n\nYour unique tracking code is: [Tracking Code].\n\nYou can monitor the status of this protocol at any time via our secure portal.\n\nInstitutional Regards,\nRiverside High School Admissions",
        sms: "Clae: Application received for [Student Name]. Code: [Tracking Code]"
    },
    {
        id: "review",
        trigger: "under_review",
        name: "Under Review",
        type: "Email",
        subject: "Protocol Update: [Student Name] - Under Evaluation",
        content: "Dear [Parent Name],\n\nThis is to inform you that [Student Name]'s enrollment application is now under official review by the Registrar's Office.\n\nNo further action is required at this time.\n\nInstitutional Regards,\nRiverside High School",
        sms: "Clae: [Student Name]'s application is now under review."
    },
    {
        id: "approved",
        trigger: "approved",
        name: "Admission Approved",
        type: "Both",
        subject: "Notice of Acceptance: [Student Name]",
        content: "Congratulations [Parent Name]!\n\nWe are pleased to inform you that [Student Name]'s application for Grade [Grade] has been APPROVED.\n\nPlease log in to the portal with your tracking code ([Tracking Code]) to complete the final registration steps.\n\nWelcome to Riverside High.\n\nInstitutional Regards,\nOffice of Enrollment",
        sms: "Congratulations! [Student Name] has been approved for admission."
    },
    {
        id: "rejected",
        trigger: "rejected",
        name: "Admission Declined",
        type: "Email",
        subject: "Enrollment Update: [Student Name]",
        content: "Dear [Parent Name],\n\nAfter careful consideration, we regret to inform you that we are unable to offer [Student Name] admission to Riverside High School for the upcoming term.\n\nWe wish you the best in your academic pursuits.\n\nInstitutional Regards,\nOffice of Enrollment",
        sms: "Clae: Update regarding [Student Name]'s application. Please check your email."
    },
    {
        id: "on_hold",
        trigger: "on_hold",
        name: "Application On Hold",
        type: "Both",
        subject: "Status Update: [Student Name] - On Hold",
        content: "Dear [Parent Name],\n\nYour application for [Student Name] has been placed on hold pending further information or availability.\n\nWe will contact you as soon as a decision is made.\n\nInstitutional Regards,\nRiverside High School",
        sms: "Clae: [Student Name]'s application is currently on hold."
    }
];
