export type OfficeKey = "ny" | "fl";

export interface OnboardingProvider {
  /** URL-safe slug for deep linking (e.g. "chase", "bank-of-america") */
  id: string;
  name: string;
  steps: string[];
  notes?: string[];
  requiredAccess?: string[];
}

export interface OnboardingSection {
  id: "bank" | "payroll" | "pos";
  title: string;
  shortTitle: string;
  intro?: string;
  providers: OnboardingProvider[];
}

export interface GuestInfo {
  name: string;
  email: string;
  phone: string;
  usernameHint: string;
  quickBooksOnline: string;
  helpfulTip?: string;
}

export interface OnboardingGuide {
  office: OfficeKey;
  label: string;
  welcomeTitle: string;
  pageTitle: string;
  subtitle: string;
  introParagraphs: string[];
  beforeYouBegin: string[];
  guestInfo: GuestInfo;
  sections: {
    bank: OnboardingSection;
    payroll: OnboardingSection;
    pos: OnboardingSection;
  };
  completionNote: string;
}

/**
 * Notice displayed near top of the onboarding page reminding clients never to email passwords.
 */
export const SECURITY_NOTICE =
  "For your security, never email or text passwords. If a platform requires login details, please share them only through our secure ShareFile link.";

export const ONBOARDING_GUIDES: Record<OfficeKey, OnboardingGuide> = {
  ny: {
    office: "ny",
    label: "New York",
    welcomeTitle: "Welcome to SMG ABA NY",
    pageTitle: "Onboarding Account Access Guide",
    subtitle: "Secure setup instructions for bank, credit card, payroll, and POS access",
    introParagraphs: [
      "As part of your onboarding, our team needs access to the financial, payroll, and point-of-sale (POS) systems used by your business. Please use this guide to add SMG ABA as a guest, accountant, or authorized user, as applicable.",
      "Complete only the sections that apply to your business. Once access has been granted, please notify our team so we can continue with the next steps of onboarding.",
    ],
    beforeYouBegin: [
      "Identify the bank, credit card, payroll, and POS platforms your business uses.",
      "Use the SMG ABA New York contact information below when adding our user unless your platform provides different instructions.",
      "For bank access, grant view-only access to the applicable business accounts unless otherwise noted.",
      "For payroll access, grant the reporting access listed for your provider.",
      "For POS access, use the platform-specific email address and permissions listed in the POS section.",
      "If you need assistance, contact our team or include us in the conversation with your bank, payroll, or platform representative.",
    ],
    guestInfo: {
      name: "Gregory Scotto",
      email: "Bookkeeper@smgaba.com",
      phone: "631-804-8257",
      usernameHint:
        "If prompted to create a username, use YourCompanyNameCPA1 (example: SMGABACPA1).",
      quickBooksOnline: "Add SMG ABA as the Accounting Firm User using Onboarding@smgaba.com",
      helpfulTip:
        "When a bank or payroll platform sends SMG ABA an invitation email, our team will complete the remaining login setup on our end.",
    },
    sections: {
      bank: {
        id: "bank",
        title: "1. Bank & Credit Card Access",
        shortTitle: "Bank & Credit Cards",
        intro:
          "Use the SMG ABA New York guest access information above when setting up bank access. Select only the business accounts SMG ABA needs to review.",
        providers: [
          {
            id: "american-express",
            name: "American Express",
            steps: [
              "Go to Account Services.",
              "Select Manage Other Users.",
              "Choose Add or Remove Account Manager.",
              "Select Add Account Manager and enter the SMG ABA New York guest access information.",
            ],
          },
          {
            id: "bank-of-america",
            name: "Bank of America",
            steps: [
              "Confirm that your online banking account includes Account Management. An upgrade may be required.",
              "Go to Business Services and select Add New User.",
              "Complete the form using the SMG ABA New York guest access information.",
              "Provide SMG ABA with the username and password created.",
              "Return to the user profile and open the Accounts & Services tab.",
              "Select Manage Access.",
              "Enable View Statements and Check Images, then save.",
            ],
          },
          {
            id: "capital-one",
            name: "Capital One",
            steps: ["Provide SMG ABA with your personal login information."],
            notes: [
              "Capital One does not offer guest user access. Please provide SMG ABA with your personal login information.",
            ],
          },
          {
            id: "paypal",
            name: "PayPal - Business Accounts",
            steps: [
              "Use PayPal's Managed Users feature to create a separate login for SMG ABA.",
              "Set the appropriate level of access for the SMG ABA user.",
            ],
            notes: [
              "The Managed Users feature is available for PayPal business accounts and allows separate login IDs with assigned access levels.",
            ],
          },
          {
            id: "td-bank",
            name: "TD Bank",
            steps: [
              "Log in to Online Banking.",
              "Go to Users & Access.",
              "Add SMG ABA as an account user and assign the appropriate permissions for the applicable business accounts.",
            ],
          },
          {
            id: "chase",
            name: "Chase Bank",
            steps: [
              "Go to Account Management.",
              "Open Access & Security Manager.",
              "Select Add Authorized User and enter the SMG ABA New York guest access information.",
              "Select Third-Party Access.",
              "Choose the bank and credit card accounts SMG ABA needs to access.",
              "Set the access level to See Activity and Transaction.",
            ],
          },
          {
            id: "truist",
            name: "Truist Bank",
            steps: [
              "Log in to Truist Business Online Banking.",
              "Go to Administration or User Management. The wording may vary depending on your setup.",
              "Select Add User.",
              "Enter Gregory Scotto and bookkeeper@smgaba.com.",
              "Set user permissions to view-only access.",
              "Select the applicable business accounts, such as checking, savings, and credit cards.",
              "Save and submit. SMG ABA will receive an email to set up our login.",
            ],
          },
          {
            id: "regions",
            name: "Regions Bank",
            steps: [
              "Log in to Regions Online Banking for Business.",
              "Navigate to Administration or User Management.",
              "Select Add User or Create New User Profile.",
              "Enter Gregory Scotto and bookkeeper@smgaba.com.",
              "Create a username and share that username with SMG ABA.",
              "Under Permissions or Access Rights, select View-Only Access with no funds transfer or payment permissions.",
              "Select the specific accounts SMG ABA should access, such as checking or credit card accounts.",
              "Set any additional restrictions you prefer, such as no mobile access or no check deposits.",
              "Review and confirm the new user profile. SMG ABA will receive an email with login setup instructions.",
            ],
          },
        ],
      },
      payroll: {
        id: "payroll",
        title: "2. Payroll System Access",
        shortTitle: "Payroll Systems",
        intro:
          "Follow the instructions for your payroll provider and grant SMG ABA the reporting access shown below.",
        providers: [
          {
            id: "adp",
            name: "ADP Payroll",
            steps: [
              "Log in to ADP and go to Settings.",
              "Select Integrated Accounting.",
              "Choose Add Tax Professional.",
              "Enter SMG ABA Firm ID: 22477505.",
            ],
            requiredAccess: ["Reports", "General Ledger", "Payroll"],
          },
          {
            id: "paychex",
            name: "Paychex Payroll",
            // TODO(confirm with client): Paychex user name is specified as "Wesley Melchiorre" while main NY guest contact is "Gregory Scotto".
            steps: [
              "Select the People List icon in the upper-right corner of the page.",
              "Select the Add button in the toolbar.",
              "Enter the user's information: Wesley Melchiorre.",
              "Click Save.",
              "Go to Company Setup > Security > Security Roles.",
              "Click Assign Users (Assign Users To Roles screen displays).",
              "Select the applicable Security Role: Accountant.",
              "If you want the Security Role to be the default role for that user, check the Default checkbox.",
              "Click Save.",
            ],
          },
          {
            id: "premier-isolved",
            name: "Premier Isolved Payroll",
            steps: [
              "Contact your Payroll Representative and ask them to add SMG ABA as a user.",
              "Use the SMG ABA New York guest access information above.",
              "Request access to Payroll Reports and Tax Reports.",
            ],
            notes: [
              "SMG ABA can also assist by coordinating with the payroll representative during this process.",
            ],
          },
          {
            id: "myisolved",
            name: "MyIsolved Payroll",
            steps: [
              "Contact your Payroll Representative and ask them to add SMG ABA as a user.",
              "Use the SMG ABA New York guest access information above.",
              "Request access to Payroll Reports and Tax Reports.",
            ],
            notes: [
              "SMG ABA can also assist by coordinating with the payroll representative during this process.",
            ],
          },
          {
            id: "heartland",
            name: "Heartland Payroll",
            steps: [
              "Contact your Payroll Representative and ask them to add SMG ABA as a user with access to Payroll Reports and Tax Reports.",
              "Complete the form provided by your representative using the SMG ABA New York guest access information.",
              "Once the form is completed, include SMG ABA on the email with your representative.",
            ],
          },
        ],
      },
      pos: {
        id: "pos",
        title: "3. POS System Access",
        shortTitle: "POS Systems",
        intro:
          "Follow the instructions for the POS platforms your business uses. Where a platform specifies a unique email address or permission set, use the platform-specific information below.",
        providers: [
          {
            id: "toast",
            name: "Toast",
            steps: [
              "Go to Employees and select Add New Employee.",
              "Set \u201cInvite to create account\u201d to Yes.",
              "First Name: SMG",
              "Last Name: ABA",
              "Email: bookkeeper@smgaba.com",
              "Assign the following permissions: POS Access, Restaurant Admin Access, and Account Admin.",
            ],
          },
          {
            id: "square",
            name: "Square",
            // TODO(confirm with client): Square email domain (bookkeeper@scottomelchiorre.com) looks odd compared to @smgaba.com.
            // TODO(confirm with client): original source had an access code here; intentionally not published
            steps: [
              "Open the Online Square Dashboard.",
              "Go to Staff > Team > + Team Member.",
              "Enter the SMG contact information, but use email: bookkeeper@scottomelchiorre.com.",
              "Set Pay Type to None.",
              "Set Team Permissions to Full Access.",
              "Our team will share the access code with you directly.",
            ],
          },
          {
            id: "stripe",
            name: "Stripe",
            // TODO(confirm with client): NY Stripe section was flagged as truncated in instructions (missing Administrator role + Invite steps). Steps reused from FL version.
            steps: [
              "Navigate to Business Settings.",
              "Click Team, then select + New Member in the upper-right corner.",
              "Email: bookkeeper@smgaba.com",
              "Select the Administrator role.",
              "Click Invite to send the invitation email.",
            ],
          },
          {
            id: "tripleseat",
            name: "Tripleseat",
            steps: [
              "Log in to your account.",
              "Navigate to Settings > Users.",
              "Click New User.",
              "Enter the SMG ABA New York guest access information shown above.",
              "Save changes.",
            ],
          },
          {
            id: "doordash",
            name: "DoorDash",
            steps: [
              "Please provide SMG ABA with the login credentials needed to access the account.",
            ],
          },
          {
            id: "grubhub",
            name: "Grubhub",
            steps: [
              "Please provide SMG ABA with the login credentials needed to access the account.",
            ],
          },
          {
            id: "uber-eats",
            name: "Uber Eats",
            steps: [
              "Log in to your account.",
              "Navigate to User Management / Team Settings.",
              "Add a new user.",
              "Enter the SMG ABA New York guest access information shown above.",
              "Assign permissions that allow access to orders, transactions, and reports.",
            ],
          },
        ],
      },
    },
    completionNote:
      "Please notify the SMG ABA New York team once you have completed the applicable access steps. If you encounter an issue, include us in the conversation with your bank, payroll, or platform representative so we can assist.",
  },

  fl: {
    office: "fl",
    label: "Florida",
    welcomeTitle: "Welcome to SMG ABA - Florida",
    pageTitle: "Onboarding Account Access Guide",
    subtitle: "Secure setup instructions for bank, credit card, payroll, and POS access",
    introParagraphs: [
      "As part of your onboarding, our team needs access to the financial, payroll, and point-of-sale (POS) systems used by your business. Please use this guide to add SMG ABA as a guest, accountant, or authorized user, as applicable.",
      "Complete only the sections that apply to your business. Once access has been granted, please notify our team so we can continue with the next steps of onboarding.",
    ],
    beforeYouBegin: [
      "Identify the bank, credit card, payroll, and POS platforms your business uses.",
      "Use the SMG ABA Florida contact information below when adding our user unless your platform provides different instructions.",
      "For bank access, grant view-only access to the applicable business accounts unless otherwise noted.",
      "For payroll access, grant the reporting access listed for your provider.",
      "For POS access, use the platform-specific email address and permissions listed in the POS section.",
      "If you need assistance, contact our team or include us in the conversation with your bank, payroll, or platform representative.",
    ],
    guestInfo: {
      name: "Gregory Scotto",
      email: "accountantfl@smgaba.com",
      phone: "727-420-1835",
      usernameHint: "If prompted to create a username, use YourCompanyName1 (example: SMGABA1).",
      quickBooksOnline: "Add SMG ABA as the Accounting Firm User using Onboarding@smgaba.com",
      helpfulTip:
        "When a bank or payroll platform sends SMG ABA an invitation email, our team will complete the remaining login setup on our end.",
    },
    sections: {
      bank: {
        id: "bank",
        title: "1. Bank & Credit Card Access",
        shortTitle: "Bank & Credit Cards",
        intro:
          "Use the SMG ABA Florida guest access information above when setting up bank access. Select only the business accounts SMG ABA needs to review.",
        providers: [
          {
            id: "american-express",
            name: "American Express",
            steps: [
              "Go to Account Services.",
              "Select Manage Other Users.",
              "Choose Add or Remove Account Manager.",
              "Select Add Account Manager and enter the SMG ABA Florida guest access information.",
            ],
          },
          {
            id: "bank-of-america",
            name: "Bank of America",
            steps: [
              "Confirm that your online banking account includes Account Management. An upgrade may be required.",
              "Go to Business Services and select Add New User.",
              "Complete the form using the SMG ABA Florida guest access information.",
              "Provide SMG ABA with the username and password created.",
              "Return to the user profile and open the Accounts & Services tab.",
              "Select Manage Access.",
              "Enable View Statements and Check Images, then save.",
            ],
          },
          {
            id: "capital-one",
            name: "Capital One",
            steps: ["Provide SMG ABA with your personal login information."],
            notes: [
              "Capital One does not offer guest user access. Please provide SMG ABA with your personal login information.",
            ],
          },
          {
            id: "paypal",
            name: "PayPal - Business Accounts",
            steps: [
              "Use PayPal's Managed Users feature to create a separate login for SMG ABA.",
              "Set the appropriate level of access for the SMG ABA user.",
            ],
            notes: [
              "The Managed Users feature is available for PayPal business accounts and allows separate login IDs with assigned access levels.",
            ],
          },
          {
            id: "td-bank",
            name: "TD Bank",
            steps: [
              "Log in to Online Banking.",
              "Go to Users & Access.",
              "Add SMG ABA as an account user and assign the appropriate permissions for the applicable business accounts.",
            ],
          },
          {
            id: "chase",
            name: "Chase Bank",
            steps: [
              "Go to Account Management.",
              "Open Access & Security Manager.",
              "Select Add Authorized User and enter the SMG ABA Florida guest access information.",
              "Select Third-Party Access.",
              "Choose the bank and credit card accounts SMG ABA needs to access.",
              "Set the access level to See Activity and Transaction.",
            ],
          },
          {
            id: "truist",
            name: "Truist Bank",
            steps: [
              "Log in to Truist Business Online Banking.",
              "Go to Administration or User Management. The wording may vary depending on your setup.",
              "Select Add User.",
              "Enter Gregory Scotto and accountantfl@smgaba.com.",
              "Set user permissions to view-only access.",
              "Select the applicable business accounts, such as checking, savings, and credit cards.",
              "Save and submit. SMG ABA will receive an email to set up our login.",
            ],
          },
          {
            id: "regions",
            name: "Regions Bank",
            steps: [
              "Log in to Regions Online Banking for Business.",
              "Navigate to Administration or User Management.",
              "Select Add User or Create New User Profile.",
              "Enter Gregory Scotto and accountantfl@smgaba.com.",
              "Create a username and share that username with SMG ABA.",
              "Under Permissions or Access Rights, select View-Only Access with no funds transfer or payment permissions.",
              "Select the specific accounts SMG ABA should access, such as checking or credit card accounts.",
              "Set any additional restrictions you prefer, such as no mobile access or no check deposits.",
              "Review and confirm the new user profile. SMG ABA will receive an email with login setup instructions.",
            ],
          },
        ],
      },
      payroll: {
        id: "payroll",
        title: "2. Payroll System Access",
        shortTitle: "Payroll Systems",
        intro:
          "Follow the instructions for your payroll provider and grant SMG ABA the reporting access shown below.",
        providers: [
          {
            id: "adp",
            name: "ADP Payroll",
            steps: [
              "Log in to ADP and go to Settings.",
              "Select Integrated Accounting.",
              "Choose Add Tax Professional.",
              "Enter SMG ABA Firm ID: 22477505.",
            ],
            requiredAccess: ["Reports", "General Ledger", "Payroll"],
          },
          {
            id: "paychex",
            name: "Paychex Payroll",
            // TODO(confirm with client): Paychex user name is specified as "Wesley Melchiorre" while main FL guest contact is "Gregory Scotto".
            steps: [
              "Select the People List icon in the upper-right corner.",
              "Click Add.",
              "Enter the SMG ABA Florida guest access. Name MUST BE Wesley Melchiorre.",
              "Go to Company Setup > Security > Security Roles.",
              "Click Assign Users.",
              "Select the Accountant security role.",
              "If appropriate, select the Default checkbox for that role.",
              "Click Save.",
            ],
          },
          {
            id: "premier-isolved",
            name: "Premier Isolved Payroll",
            steps: [
              "Contact your Payroll Representative and ask them to add SMG ABA as a user.",
              "Use the SMG ABA Florida guest access information above.",
              "Request access to Payroll Reports and Tax Reports.",
            ],
            notes: [
              "SMG ABA can also assist by coordinating with the payroll representative during this process.",
            ],
          },
          {
            id: "myisolved",
            name: "MyIsolved Payroll",
            steps: [
              "Contact your Payroll Representative and ask them to add SMG ABA as a user.",
              "Use the SMG ABA Florida guest access information above.",
              "Request access to Payroll Reports and Tax Reports.",
            ],
            notes: [
              "SMG ABA can also assist by coordinating with the payroll representative during this process.",
            ],
          },
          {
            id: "heartland",
            name: "Heartland Payroll",
            steps: [
              "Contact your Payroll Representative and ask them to add SMG ABA as a user with access to Payroll Reports and Tax Reports.",
              "Complete the form provided by your representative using the SMG ABA Florida guest access information.",
              "Once the form is completed, include SMG ABA on the email with your representative.",
            ],
          },
        ],
      },
      pos: {
        id: "pos",
        title: "3. POS System Access",
        shortTitle: "POS Systems",
        intro:
          "Follow the instructions for the POS platforms your business uses. Where a platform specifies a unique email address or permission set, use the platform-specific information below.",
        providers: [
          {
            id: "toast",
            name: "Toast",
            // TODO(confirm with client): FL Toast uses email "bookkeeper@smgaba.com" whereas FL main guest contact email is "accountantfl@smgaba.com".
            steps: [
              "Go to Employees and select Add New Employee.",
              "Set \u201cInvite to create account\u201d to Yes.",
              "First Name: SMG",
              "Last Name: ABA",
              "Email: bookkeeper@smgaba.com",
              "Assign the following permissions: POS Access, Restaurant Admin Access, and Account Admin.",
            ],
          },
          {
            id: "square",
            name: "Square",
            // TODO(confirm with client): Square email domain (bookkeeper@scottomelchiorre.com) looks odd compared to @smgaba.com.
            // TODO(confirm with client): original source had an access code here; intentionally not published
            steps: [
              "Open the Online Square Dashboard.",
              "Go to Staff > Team > + Team Member.",
              "Enter the SMG contact information, but use email: bookkeeper@scottomelchiorre.com.",
              "Set Pay Type to None.",
              "Set Team Permissions to Full Access.",
              "Our team will share the access code with you directly.",
            ],
          },
          {
            id: "stripe",
            name: "Stripe",
            // TODO(confirm with client): FL Stripe uses email "bookkeeper@smgaba.com" vs FL contact "accountantfl@smgaba.com".
            steps: [
              "Navigate to Business Settings.",
              "Click Team, then select + New Member in the upper-right corner.",
              "Email: bookkeeper@smgaba.com",
              "Select the Administrator role.",
              "Click Invite to send the invitation email.",
            ],
          },
          {
            id: "tripleseat",
            name: "Tripleseat",
            steps: [
              "Log in to your account.",
              "Navigate to Settings > Users.",
              "Click New User.",
              "Enter the SMG ABA Florida guest access information shown above.",
              "Save changes.",
            ],
          },
          {
            id: "doordash",
            name: "DoorDash",
            steps: [
              "Please provide SMG ABA with the login credentials needed to access the account.",
            ],
          },
          {
            id: "grubhub",
            name: "Grubhub",
            steps: [
              "Please provide SMG ABA with the login credentials needed to access the account.",
            ],
          },
          {
            id: "uber-eats",
            name: "Uber Eats",
            steps: [
              "Log in to your account.",
              "Navigate to User Management / Team Settings.",
              "Add a new user.",
              "Enter the SMG ABA Florida guest access information shown above.",
              "Assign permissions that allow access to orders, transactions, and reports.",
            ],
          },
        ],
      },
    },
    completionNote:
      "Please notify the SMG ABA Florida team once you have completed the applicable access steps. If you encounter an issue, include us in the conversation with your bank, payroll, or platform representative so we can assist.",
  },
};

export function isOfficeKey(key: string | undefined): key is OfficeKey {
  return key === "ny" || key === "fl";
}
