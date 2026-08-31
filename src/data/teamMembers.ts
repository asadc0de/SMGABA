export interface TeamMember {
  name: string;
  role: string;
  category: string;
  email: string;
  avatar: string;
  bio: string;
  credentials?: string[];
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    "name": "Gregory M. Scotto, CPA",
    "role": "Managing Partner",
    "category": "Partners",
    "email": "Gregory@smgaba.com",
    "avatar": "https://www.smgaba.com/wp-content/uploads/2022/02/Greg-scaled.jpg",
    "bio": "Gregory’s leadership, drive for success, and dedication to his clients and his team has grown SMG to be recognized as one of the fastest growing accounting and bookkeeping firms in the nation. His clients consider him an asset to not only their businesses, but their overall financial well-being. Gregory has acted in a professional and efficient manner to assist and improve profitability and cash flow for many of his clients. Gregory earned a bachelor’s degree from the Zicklin School of Business at Bernard Baruch College and has been a licensed Certified Public Accountant since 2009."
  },
  {
    "name": "Wesley S. Melchiorre, EA",
    "role": "Managing Partner",
    "category": "Partners",
    "email": "Wesley@smgaba.com",
    "avatar": "https://www.smgaba.com/wp-content/uploads/2022/02/Wes-scaled.jpg",
    "bio": "Wesley is an experienced trusted advisor and leads the Firm’s Hospitality Industry practice. Wesley takes a modernized approach to assisting his clients in optimizing their profitability. His clients consider him a valued asset to their businesses and have celebrated his efforts on many occasions after countless successful working relationships over the years. Wesley’s experiences have led him to become one of the most sought-after advisors in the hospitality arena where he prides himself on his communication and additional efforts in providing operators with various avenues to financial success. Wesley earned a BS in Corporate Finance and Accounting from Bentley University and has been an Enrolled Agent since 2011."
  },
  {
    "name": "David M. Isaacs II, MBA, EA",
    "role": "Partner",
    "category": "Partners",
    "email": "David@smgaba.com",
    "avatar": "https://www.smgaba.com/wp-content/uploads/2022/01/Dave-1-scaled.jpg",
    "bio": "David prides himself on work ethic, responsiveness, and passion. His level of dedication to his clients has proven to be successful as he receives tremendous positive feedback. With over ten years of experience, David communicates with business owners on a frequent basis and his overall support has been a driving factor in maintaining profitability and compliance. Clients consider him an integral part of their day-to-day operations to sustain their path to success. David earned an MBA from St. Joseph’s College and has been an Enrolled Agent since 2019."
  },
  {
    "name": "Marc Valente, CPA",
    "role": "Partner",
    "category": "Partners",
    "email": "Marc@smgaba.com",
    "avatar": "https://www.smgaba.com/wp-content/uploads/2025/07/DSC05294-1-scaled.jpg",
    "bio": "Marc has spent most of his 20-year career in taxation serving small business and middle market clients at Top 10 accounting firms. Marc has a broad range of tax and audit experience providing personal and customized service to both private and public companies of all sizes. He has had the pleasure of assisting companies at various stages of their lifecycle including the startup, growth, established, expansion, maturity and exit stages. He enjoys working collaboratively with family business owners and key company executives on tax strategy to minimize taxes and maximize value."
  },
  {
    "name": "Erin Connors CPA, CVA",
    "role": "Partner - St. Petersburg",
    "category": "Partners",
    "email": "Erin@smgaba.com",
    "avatar": "https://www.smgaba.com/wp-content/uploads/2026/08/Erin-1.png",
    "bio": "Erin is a Certified Public Accountant and Certified Valuation Analyst who has spent most of her career serving clients in the Tampa Bay area. Erin’s practice is built on a foundation of accuracy, integrity, and personalized service. Erin offers a comprehensive range of accounting and advisory solutions, including bookkeeping, financial management, international tax, family office support, forensic accounting, tax planning and preparation. Throughout Erin’s career, she has been committed to helping individuals and businesses achieve financial clarity and long-term success. Erin’s approach combines technical expertise with a deep understanding of client needs, ensuring solutions that are both strategic and practical. Erin earned her Bachelor of Science in Accounting from the University of Central Florida. She is a member of both the Florida Institute of Certified Public Accounts and the American Institute of Certified Public Accountants."
  },
  {
    "name": "Marianne Hasselbach, CPA",
    "role": "Partner - St. Petersburg",
    "category": "Partners",
    "email": "Marianne@smgaba.com",
    "avatar": "https://www.smgaba.com/wp-content/uploads/2026/08/Marriane-1.png",
    "bio": "Marianne is an accomplished Certified Public Accountant and Florida native from Treasure Island, bringing more than twenty-five years of experience providing thoughtful, personalized financial guidance to businesses and individuals. She takes a partnership approach with every client—offering insight, clarity, and a steady hand to help them achieve their financial goals. As a fiduciary, Marianne provides services and advice solely in the best interest of her clients. She is honored to serve as Trustee on some of her client's Trusts. Her expertise includes comprehensive tax planning and preparation, financial reporting, and audit services. Her responsiveness, attention to detail, and collaborative style have earned her the trust of clients, financial institutions, and legal professionals alike. Marianne earned her Bachelor of Science from the University of Florida and completed her Accounting Program at the University of South Florida. She is a member of both the Florida Institute of Certified Public Accountants (FICPA) and the American Institute of Certified Public Accountants (AICPA)."
  },
  {
    "name": "Maria Aruanna, CPA",
    "role": "Managing Director",
    "category": "Directors & Executive Advisory",
    "email": "MAruanna@smgaba.com",
    "avatar": "https://www.smgaba.com/wp-content/uploads/2022/01/Maria-1-scaled.jpg",
    "bio": "Maria has provided a value unparalleled to SMG and her clients. She possesses hard work ethics, care, and passion which translates into a larger part of the firm's and client's overall success. Although her tasks can be difficult and voluminous, she takes on the firm's and client's goals as her own and displays an admirable level of professionalism and determination. Since the pandemic started, Maria has overseen the SBA/IRS relief programs which has brought significant financial assistance to many businesses. Maria earned a MS in Taxation from Old Westbury."
  },
  {
    "name": "Leeat Shalom",
    "role": "Director of Operations",
    "category": "Directors & Executive Advisory",
    "email": "LShalom@smgaba.com",
    "avatar": "https://www.smgaba.com/wp-content/uploads/2025/10/Leeat-Headshot.jpg",
    "bio": "With over a decade of experience in the financial services industry, Leeat Shalom is a highly accomplished Director of Operations known for her expertise in leading teams and driving operational efficiencies. At the forefront of business transformation, Leeat specializes in optimizing processes, enhancing systems integration, and developing innovative strategies that improve performance and client satisfaction. Leeat works closely with the SMG team to ensure alignment between business objectives and operational execution. A natural leader with a deep commitment to continuous improvement, Leeat excels in fostering collaborative, high-performing teams while promoting a culture of excellence. Her passion for innovation, combined with her comprehensive understanding of business management and finance, makes her a trusted leader in driving sustainable growth and operational success."
  },
  {
    "name": "Kevin Levine, CPA, MST",
    "role": "Senior Tax Director",
    "category": "Directors & Executive Advisory",
    "email": "KLevine@smgaba.com",
    "avatar": "https://www.smgaba.com/wp-content/uploads/2026/07/KEVIN-LEVINE-scaled.jpg",
    "bio": "Kevin advises clients across a wide range of business sectors, including real estate, professional services, sports and entertainment, apparel manufacturing, hospitality and food service and many others. Working closely with clients and their professional teams, Kevin ensures that services and advice are fully coordinated for informed decision-making. Kevin has a deep knowledge in the areas of federal, state, and local tax planning and compliance. He works with an array of clients – including high net worth individuals and their families, trusts, and foundations, executives, and closely held businesses – on state and interstate tax issues. His expertise in this area includes guiding clients through tax controversies at every level. Kevin also has experience consulting on the US taxation of foreign nationals and foreign-owned corporations. For clients looking at retirement, he consults on approaches to maximize wealth transfer to descendants through tax deferral and other strategies. Kevin has also spoken at various tax conferences including programs on Tax and Estate Planning Issues for US Residents and Nonresident Aliens and the Immigration Law Foundation’s Annual Conference. He is also a member of the American Institute of Certified Public Accountants and the New York State Society of Certified Public Accountants."
  },
  {
    "name": "Mohammed Syed, CPA",
    "role": "Senior Tax Manager",
    "category": "Tax & Compliance",
    "email": "MSyed@smgaba.com",
    "avatar": "https://www.smgaba.com/wp-content/uploads/2026/07/MOHAMMED-SYED-scaled.jpeg",
    "bio": "Mohammed brings more than 17 years of experience advising individuals, closely held businesses, and high‑net‑worth clients on tax compliance and planning. His expertise includes pass‑through taxation, real estate transactions, small businesses, and complex multi‑state tax matters, helping clients navigate issues with clarity and confidence. He holds a bachelor’s degree from Osmania University, India, and from Brooklyn College, NY. He is a member of the AICPA."
  },
  {
    "name": "Corey Adams, CPA, CFP",
    "role": "Senior Tax Manager - St. Petersburg",
    "category": "Tax & Compliance",
    "email": "CAdams@smgaba.com",
    "avatar": "https://www.smgaba.com/wp-content/uploads/2026/08/Corey-2.png",
    "bio": "Corey has spent his career providing comprehensive tax planning, compliance, and advisory services to business owners, high-income individuals, family offices, and real estate investors. He takes a holistic approach that integrates tax strategy and financial planning to help clients minimize taxes and build long-term wealth. Corey is known for his proactive communication and ability to simplify complex tax matters, providing clients with confidence and clarity in their financial decisions. He earned a Bachelor’s degree in Finance and Accounting from the University of South Florida and is credentialed as both a Certified Public Accountant and Certified Financial Planner™."
  },
  {
    "name": "Kinshuk Sharma",
    "role": "Accounting Manager",
    "category": "Accounting & Client Services",
    "email": "KSharma@smgaba.com",
    "avatar": "https://www.smgaba.com/wp-content/uploads/2025/10/Kin-scaled.jpg",
    "bio": "Kinshuk “Kin” joined SMG ABA in February 2020, just as the world was rapidly changing. Starting as bookkeeper, he steadily expanded his skills and responsibilities, moving into tax, and supervisory roles before ultimately stepping into his current position as the Accounting Manager. In this role, Kin leads the accounting team and oversees all aspects of bookkeeping, reporting, client communication, workflow management, and cross-departmental coordination. His leadership helps ensure smooth operations and exceptional service for SMG’s clients. Known for his adaptability, care, compassion, and objective approach to challenges, Kin is always willing to step in wherever needed to get the job done. Even when faced with unfamiliar situations, he is quick to assess, learn, and chart the best path forward while maintaining SMG's core values. This commitment to collaboration and problem solving has made Kin an integral part of SMG ABA’s success."
  },
  {
    "name": "Cynthia Cortes",
    "role": "Onboarding Manager",
    "category": "Accounting & Client Services",
    "email": "CCortes@smgaba.com",
    "avatar": "https://www.smgaba.com/wp-content/uploads/2026/07/CYNTHIA-CORTES-scaled.jpeg",
    "bio": "Cynthia joined the SMG team 8 years ago as a Bookkeeper. She has over 15 years of experience working in Office Management where she grew the skills necessary to understand the discipline of managing the operations of a business. Her passion to learn, overall care for the clients, team and the overall goals of the firm have led to her advancement as Bookkeeping Supervisor. Cynthia is a team leader, she makes sure everyone is productive and she cares for everyone’s wellbeing. To her testimonial clients that have had the pleasure of working with Cynthia request her and rely on her, as they should. Apart from Cynthia's hard work and can do attitude, she also is involved in the betterment of her community, which is a true testament to her overall care."
  },
  {
    "name": "James Fleming",
    "role": "Supervisor",
    "category": "Accounting & Client Services",
    "email": "JFleming@smgaba.com",
    "avatar": "https://www.smgaba.com/wp-content/uploads/2026/07/JAMES-FLEMING.jpeg-scaled.jpg",
    "bio": "James Fleming has been with SMG for 8 years, where he plays a key role in both individual and business tax services. Known for his steady approach and deep technical knowledge, he works closely with clients to help navigate complex tax matters and ensure accuracy, compliance, and clarity throughout the process."
  },
  {
    "name": "Dominic Savino",
    "role": "Supervisor",
    "category": "Accounting & Client Services",
    "email": "DSavino@smgaba.com",
    "avatar": "https://www.smgaba.com/wp-content/uploads/2026/08/DOMINIC-SAVINO-edited-scaled.png",
    "bio": "Dominic Savino has been with SMG for 5 years, specializing in CFO services and tax strategy. He also leads the firm’s technology and integration efforts, helping streamline systems and improve efficiency across operations. His work bridges finance and innovation, supporting both clients and internal teams with smarter solutions."
  },
  {
    "name": "Alejandro García Díaz, MBA",
    "role": "CFO",
    "category": "Directors & Executive Advisory",
    "email": "agarcia@smgaba.com",
    "avatar": "https://www.smgaba.com/wp-content/uploads/2026/08/Alejandro-1.png",
    "bio": "Alejandro brings over 15 years of senior corporate finance leadership, specializing in financial strategy, process automation, and long-term value creation. Having served as CFO for mid-to-large enterprises across manufacturing, consumer goods, and investment banking, he approaches client growth with a blend of institutional rigor and practical execution. Known for his approachable leadership style and dedication to problem-solving, Alejandro works side-by-side with business owners to build resilient cash flows, optimize operations, and turn complex data into clear, actionable strategy. Alejandro holds a Master’s degree in Business Management from ICESI University, a Postgraduate Diploma in Corporate Finance and Capital Markets, and a Bachelor’s degree in Economics."
  },
  {
    "name": "Courtney Santiago",
    "role": "Human Resources Manager",
    "category": "Operations & HR",
    "email": "csantiago@smgaba.com",
    "avatar": "https://www.smgaba.com/wp-content/uploads/2026/08/Courtney-1.png",
    "bio": "Courtney serves as Human Resources Manager at SMG, bringing diverse experience across staffing, finance, government, entertainment, sports, and hospitality. Her broad professional background and passion for helping people allow her to approach human resources with purpose, care, and a commitment to making a lasting impact. Courtney earned her Bachelor of Arts in Organizational Psychology from the University of South Florida in Tampa and her Master of Science in Organizational Sciences from Florida International University in Miami. Born in New York and now residing in Florida, Courtney is dedicated to supporting SMG’s team and fostering a positive, people-focused workplace."
  }
];
