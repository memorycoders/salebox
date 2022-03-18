// @flow
import * as React from 'react';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import * as authActions from 'components/Auth/auth.actions';
import { Modal, Button} from 'semantic-ui-react';

// import ToSContent from './ToSContent';

type PropsT = {
  isOpened: boolean,
  handleToUModalClose: (event: Event, {}) => void,
  handleToUModalAccept: (event: Event, {}) => void,
  onCloseTermOfUse: () => void
};

import _l from 'lib/i18n';
addTranslations({
  'en-US': {
    'Terms of use': 'Terms of use',
    'Accept': 'Accept',
  },
});

import css from './TermOfUseModal.css';

const TermOfUseModal = ({
  isOpened,
  isSignupPage=true,
  onCloseTermOfUse,
  handleToUModalClose,
  handleToUModalAccept,
}: PropsT) => {
  return (
    <div className={css.root}>
      <Modal className={css.tos}
        open={isOpened}
        closeOnEscape={true}
        closeOnDimmerClick={true}
        >
        <Modal.Header className={css.header}>
          {_l`Terms of use`}
        </Modal.Header>
        <Modal.Content scrolling className={css.content}>
          {/* <div dangerouslySetInnerHTML={ {__html: _ToSHTML} } /> */}
          {/* {require('text!./tos.html')} */}
          {
           <div>
             <h2>Salesbox terms of use</h2><br/>

             <b>Subscription Agreement</b>
             <p>This agreement governs your acquisition and use of our service. If you register for two (2) free trial Users of our service, this agreement will also govern those two (2) free trial Users.</p>
             <p>By accepting this agreement, either by clicking a box indicating your acceptance or by executing an order form that references this agreement, you agree to the terms of this agreement. If you are entering into this agreement on behalf of a company or other legal entity, you represent that you have the authority to bind such entity and its affiliates to these terms and conditions, in which case the terms "You" or "Your" shall refer to such entity and its affiliates. If you do not have such authority, or if you do not agree with these terms and conditions, you must not accept this agreement and may not use the services.</p>
             <p>You may not access the Services if You are Our direct competitor, except with Our prior written consent. In addition, You may not access the Services for purposes of monitoring their availability, performance or functionality, or for any other benchmarking or competitive purposes.</p>
             <p>This Agreement was last updated on November 16, 2015. It is effective between You and Us as of the date of You accepting this Agreement.</p>

             <b>Table of Contents</b>
             <p>1. Definitions</p>
             <p>2. Free Trial Users</p>
             <p>3. Our Responsibilities</p>
             <p>4. Use of the Services and Content</p>
             <p>5. Non-Salesbox CRM Providers</p>
             <p>6. Fees and Payment for Purchased Services</p>
             <p>7. Proprietary Rights and Licenses</p>
             <p>8. Confidentiality</p>
             <p>9. Representations, Warranties, Exclusive Remedies and Disclaimers</p>
             <p>10. Mutual Indemnification</p>
             <p>11. Limitation of Liability</p>
             <p>12. Term and Termination</p>
             <p>13. Who You Are Contracting With, Notices, Governing Law and Jurisdiction</p>
             <p>14. General Provisions</p>
             <p>15. Reselling the Service from the Service</p>
             <p>16. GDPR</p>


             <b>1. DEFINITIONS</b>
             <p>"Affiliate" means any entity that directly or indirectly controls, is controlled by, or is under common control with the subject entity. "Control," for purposes of this definition, means direct or indirect ownership or control of more than 50% of the voting interests of the subject entity.</p>
             <p>"Agreement" means this Subscription Agreement.</p>
             <p>"Beta Services" means Our services that are not generally available to customers.</p>
             <p>"Content" means information obtained by Us from Our content licensors or publicly available sources and provided to You pursuant to an Order Form, as more fully described in the Documentation.</p>
             <p>"Documentation" means Our online user guides, documentation, and help and training materials, as updated from time to time, accessible via www.salesboxcrm.com or the Service.</p>
             <p>"Malicious Code" means code, files, scripts, agents or programs intended to do harm, including, for example, viruses, worms, time bombs and Trojan horses.</p>
             <p>"Marketplace" means Apple App store, an online directory, catalog or marketplace of applications that interoperate with the Services.</p>
             <p>"Non-Salesbox CRM Applications" means any online or offline software application that is provided by You, Your Affiliate or a third party and interoperates with the Service, including, for example, an application that is developed by or for You, is listed on a Marketplace.</p>
             <p>"Order Form" means digital functions in the Service specifying the number of Users of the Service that You or Your Affiliate order, Your or Your Affiliate's billing information and Your or Your Affiliate's company information. By entering information into the Order Form, You agree to be bound by the terms of this Agreement.</p>
             <p>"Purchased Service" means a Service that You or Your Affiliate purchase under an Order Form, as distinguished from those provided pursuant to a free trial.</p>
             <p>"Service" means the product that is ordered by You under a free trial or an Order Form and made available through Apples App store by Us, including any associated components. "Service" exclude Non-Salesbox CRM Applications.</p>
             <p>"User" means an individual who is authorised by You to use the Service, for whom You have ordered the Service, and to whom You (or We at Your request) have supplied a user identification and password. Users may include, for example, Your employees, consultants, contractors and agents, and third parties with which You transact business.</p>
             <p>"End User" means any third party entity or individual, outside You or Your Affiliate, that acquires a license subscription via a recruitment invitation from You sent from the reselling function in the Service.</p>
             <p>"We,""Us" or "Our" means the Salesbox CRM-System AB company described in Section 13 (Who You Are Contracting With, Notices, Governing Law and Jurisdiction).</p>
             <p>"You" or "Your" means You as an individual or the company or other legal entity for which you are accepting this Agreement, and Affiliates of that company or entity.</p>
             <p>"Your Data" means any electronic data and information submitted by or for You to the Purchased Service or collected and processed by or for You using the Purchased Service.</p>
             <p>"Your Business Data" means data about the business relationship between You and contacts and organisations listed in the Service by You a User or any other user of the Service. It also means any explicit information about Your appointments, tasks, qualified deals and unqualified deals. This does not include information such as but not limited to telephone number, e-mail, website, address, name, first name, last name, DISC-profile</p>
             <p>"Device" means the device you use to access the Service.</p>
             <p>"Provided Contact Content" means any content to all contacts You import from either Your Device or any social media that the Service is connected to. This can be, but not limited to, telephone numbers, e-mail addresses, addresses, first name, last name, employer.</p>
             <p>"Public Content" means information that is shared and can be updated by You, any User or End User on the objects contact and organisation in the Service. This information includes, but is not limited to, first name, last name, company name, addresses, telephone numbers, e-mails, size, industry, web site.</p>
             <p>"Photo files" means any photos You have uploaded to any object in the Service.</p>
             <p>"Partner" means any company that has an exclusive partner agreement directly with Us stating exclusivity to collect reseller commission in a certain geographical or business area.</p>
             <p>"User Guide" means a digital manual describing the Service provided by Us.</p>


             <b>2. FREE TRIAL USERS</b>
             <p>2.1. If You register in the Service, We will make the Service available to You free of charge for maximum two (2) Users during a 14 day trial. These two (2) free trial Users use the Service according to the terms in this Agreement exactly like any additional paying users. After the 14 day trial You need to subscribe to the Service for any Users and will be charged a subscription fee.</p>
               <p>2.2. Not with standing section 9 (representations, warranties, exclusive remedies and disclaimers), for the free Users the services are provided "as-is" without any warranty.</p>

               <b>3. OUR RESPONSIBILITIES</b>
               <p>3.1. Provision of Purchased Services. We will (a) make the Services and Content available to You pursuant to this Agreement and the applicable Order Forms (b) use commercially reasonable efforts to make the online Purchased Services available, except for: (i) planned downtime, and (ii) any unavailability caused by circumstances beyond Our reasonable control, including, for example, an act of God, act of government, flood, fire, earthquake, civil unrest, act of terror, strike or other labor problem, Internet service provider failure or delay, Non-Salesbox CRM Application, or denial of service attack, (iii) any downtime caused by third party responsible for the hosting of the Service.</p>
               <p>3.2. Protection of Your Data. We will maintain reasonable administrative, physical, and technical safeguards for protection of the security, confidentiality and integrity of Your Data, as described in the Documentation. Those safeguards will include, but will not be limited to, measures for preventing access, use, modification or disclosure of Your Data by Our personnel except (a) to provide the Purchased Service and prevent or address service or technical problems, (b) as compelled by law in accordance with Section 8.3 (Compelled Disclosure) below, or (c) as You expressly permit in writing. (d) as according to Section 4.6.</p>
               <p>3.3. Our Personnel. We will be responsible for the performance of Our personnel (limited to Our employees) and their compliance with Our obligations under this Agreement, except as otherwise specified herein.</p>
               <p>3.4. Beta Services. From time to time, We may invite You to try Beta Services at no charge. You may accept or decline any such trial in Your sole discretion. Beta Services will be clearly designated as beta, pilot, limited release, developer preview, non-production, evaluation or by a description of similar import. Beta Services are for evaluation purposes and not for production use, are not considered "Service" under this Agreement, are not supported, and may be subject to additional terms. Unless otherwise stated, any Beta Services trial period will expire upon the earlier of one year from the trial start date or the date that a version of the Beta Services becomes generally available. We may discontinue Beta Services at any time in Our sole discretion and may never make them generally available. We will have no liability for any harm or damage arising out of or in connection with a Beta Service.</p>

               <b>4. USE OF SERVICES AND CONTENT</b>
               <p> 4.1. Subscription. Unless otherwise provided in the applicable Order Form, (a) the Service is purchased as a subscription, (b) subscriptions may be added during a subscription term at the same pricing as the underlying subscription pricing, prorated for the portion of that subscription term remaining at the time the subscriptions are added, and (c) any added subscriptions will terminate on the same date as the underlying subscriptions.</p>
               <p> 4.2. Usage Limits. The Service is subject to usage limits, including, for example, the quantities specified in Order Forms. Unless otherwise specified, (a) a quantity in an Order Form refers to Users, and the Service may not be accessed by more than that number of Users, (b) a User's password may not be shared with any other individual, and (c) a User identification may be reassigned to a new individual replacing one who no longer requires ongoing use of the Service. If You exceed a contractual usage limit, We may work with You to seek to reduce Your usage so that it conforms to that limit. If, notwithstanding Our efforts, You are unable or unwilling to abide by a contractual usage limit, You will execute an Order Form for additional quantities of the applicable Services or Content promptly upon Our request, and/or pay any invoice for excess usage in accordance with Section 6.2 (Invoicing and Payment).</p>
               <p> 4.3. Your Responsibilities. You will (a) be responsible for Users' compliance with this Agreement, (b) be responsible for the accuracy, quality and legality of Your Data and the means by which You acquired Your Data, (c) use commercially reasonable efforts to prevent unauthorised access to or use of the Service, and notify Us promptly of any such unauthorised access or use, (d) use the Service only in accordance with the Documentation and applicable laws and government regulations, and (e) comply with terms of service of Non- Salesbox CRM Applications with which You use the Service.</p>
               <p> 4.4. Usage Restrictions. You will not (a) make the Service or Content available to, or use the Service or Content for the benefit of, anyone other than You or Users, (b) sell, resell, license, sublicense, distribute, rent or lease the Service or Content, or include the Service or Content in a service bureau or outsourcing offering, except what is stated in Section 15, (c) use the Service to store or transmit infringing, libelous, or otherwise unlawful or tortious material, or to store or transmit material in violation of third-party privacy rights, (d) use the Service to store or transmit Malicious Code, (e) interfere with or disrupt the integrity or performance of the Service or Content or third-party data contained therein, (f) attempt to gain unauthorised access to the Service or Content or its related systems or networks, (g) permit direct or indirect access to or use of the Service or Content in a way that circumvents a contractual usage limit, (h) copy the Service or Content or any part, feature, function or user interface thereof, (i) copy Content except as permitted herein or in an Order Form or the Documentation, (j) frame or mirror any part of the Service or Content, (k) access the Service or Content in order to build a competitive product or service, or (l) reverse engineer the Service (to the extent such restriction is permitted by law).</p>
               <p> 4.5. Removal of Content and Non-Salesbox CRM Applications. If We are required by a licensor to remove Content, or receive information that Content provided to You may violate applicable law or third-party rights, We may so notify You and in such event You will promptly remove such Content from Your systems. If We receive information that a Non-Salesbox CRM Application hosted on a Service by You may violate applicable law or third-party rights, We may so notify You and in such event You will promptly disable such Non-Salesbox CRM Application or modify the Non-Salesbox CRM Application to resolve the potential violation. If You do not take required action in accordance with the above, We may disable the applicable Content, Service and/or Non-Salesbox CRM Application until the potential violation is resolved.</p>
               <p> 4.6. We get the right to use Your data, Your Business data in anonymous form for creating future services.</p>
               <p> 4.7. If You deliberately are tampering with Public Content in a way that other users of the Service report this to Us, We have the right to exclude you from the Service without any warning and any right for You to get a Refund.</p>

               <b>5. NON-Salesbox CRM PROVIDERS</b>
               <p> 5.1. Acquisition of Non-Salesbox CRM Products and Services. We or third parties may make available (for example, through a Marketplace or otherwise) third-party products or services, including, for example, Non- Salesbox CRM Applications and implementation and other consulting services. Any acquisition by You of such non- Salesbox CRM products or services, and any exchange of data between You and any non-Salesbox CRM provider, is solely between You and the applicable non-Salesbox CRM provider. We do not warrant or support Non- Salesbox CRM Applications or other non-Salesbox CRM products or services, whether or not they are designated by Us as "certified" or otherwise, except as specified in an Order Form.</p>
               <p> 5.2. Non-Salesbox CRM Applications and Your Data. If You install or enable a Non-Salesbox CRM Application for use with the Service, You grant Us permission to allow the provider of that Non-Salesbox CRM Application to access Your Data as required for the interoperation of that Non-Salesbox CRM Application with the Service. We are not responsible for any disclosure, modification or deletion of Your Data resulting from access by a Non-Salesbox CRM Application.</p>
               <p> 5.3. Integration with Non-Salesbox CRM Applications. The Service may contain features designed to interoperate with Non-Salesbox CRM Applications. To use such features, You may be required to obtain access to Non-Salesbox CRM Applications from their providers, and may be required to grant Us access to Your account(s) on the Non-Salesbox CRM Applications. If the provider of a Non-Salesbox CRM Application ceases to make the Non- Salesbox CRM Application available for interoperation with the corresponding Service features on reasonable terms, We may cease providing those Service features without entitling You to any refund, credit, or other compensation.</p>

               <b>6. FEES AND PAYMENT FOR PURCHASED SERVICES</b>
               <p> 6.1. The Service retails as a subscription fee unless anything else has been agreed as a written addition to this Agreement.</p>
               <p> 6.2. We have the right to, at any given time, change the subscription fee.</p>
               <p> 6.3. Fees. You will pay all fees specified in Order Forms. The subscription fee for each ordered and or activated paying User is paid by You 1 subscription period ahead, periodically, as an upfront payment. Except as otherwise specified herein or in an Order Form, (i) fees are based on the Service and Content purchased and not actual usage, (ii) payment obligations are non- cancelable and fees paid are non-refundable, and (iii) quantities purchased cannot be decreased during the relevant subscription term.</p>
               <p> 6.4. Invoicing and Payment. You will provide Us with valid and updated credit card information, or with a valid purchase order or alternative document reasonably acceptable to Us. If You provide credit card information to Us, You authorise Us to charge such credit card for all Purchased Services listed in the Order Form for the initial subscription term and any renewal subscription term(s) as set forth in Section 12.2 (Term of Purchased Subscriptions). Such charges shall be made in advance of any type of subscription period. We will charge your credit card directly after any given trial period has ended and You have not actively terminated your subscription of the Service by clicking the appropriate button in the Service. If the Order Form specifies that payment will be by a method other than a credit card, We will invoice You in advance and otherwise in accordance with the relevant Order Form. Unless otherwise stated in the Order Form, invoiced charges are due net 5 days from the invoice date. You are responsible for providing complete and accurate billing and contact information to Us and notifying Us of any changes to such information.</p>
               <p> 6.5. Overdue Charges. If any invoiced amount is not received by Us by the due date, then without limiting Our rights or remedies, (a) those charges may accrue late interest at the rate of 2 % of the outstanding balance per month, or the maximum rate permitted by law, whichever is lower, and/or (b) We may condition future subscription renewals and Order Forms on payment terms shorter than those specified in Section 6.2 (Invoicing and Payment).</p>
               <p> 6.6. Suspension of the Service and Acceleration. If any amount owing by You under this or any other agreement for Our services is 5 or more days overdue (or 5 or more days overdue in the case of amounts You have authorised Us to charge to Your credit card), We may, without limiting Our other rights and remedies, accelerate Your unpaid fee obligations under such agreements so that all such obligations become immediately due and payable, and suspend the Service to You until such amounts are paid in full. We will give You at least 5 days prior notice that Your account is overdue, in accordance with Section 13.2 (Manner of Giving Notice), before suspending services to You.</p>
               <p> 6.7. Payment Disputes. We will not exercise Our rights under Section 6.5 (Overdue Charges) or 6.6 (Suspension of Service and Acceleration) above if You are disputing the applicable charges reasonably and in good faith and are cooperating diligently to resolve the dispute.</p>
               <p> 6.8. Taxes. Our fees do not include any taxes, levies, duties or similar governmental assessments of any nature, including, for example, value-added, sales, use or withholding taxes, assessable by any jurisdiction whatsoever (collectively, "Taxes"). You are responsible for paying all Taxes associated with Your purchases hereunder. If We have the legal obligation to pay or collect Taxes for which You are responsible under this Section 6.8, We will invoice You and You will pay that amount unless You provide Us with a valid tax exemption certificate authorised by the appropriate taxing authority. For clarity, We are solely responsible for taxes assessable against Us based on Our income, property and employees.</p>
               <p> 6.9. Functionality. You agree that Your purchases are not contingent on the delivery of any future functionality or features, or dependent on any oral or written public comments made by Us regarding future functionality or features. You also agree that Your purchases are not contingent on if bugs exist or individual features and/or functionality do not operate exactly like expected.</p>

               <b>7. PROPRIETARY RIGHTS AND LICENSES</b>
               <p> 7.1. Reservation of Rights. Subject to the limited rights expressly granted hereunder, We and Our licensors reserve all of Our/their right, title and interest in and to the Service and Content, including all of Our/their related intellectual property rights. No rights are granted to You hereunder other than as expressly set forth herein.</p>
               <p> 7.2. License by Us to Use Content. We grant to You a worldwide, limited-term license, under Our applicable intellectual property rights and licenses, to use Content acquired by You pursuant to Order Forms, subject to those Order Forms, this Agreement and the Documentation.</p>
               <p> 7.3. License by You to Host Your Data and Applications. You grant Us and Our Affiliates a worldwide, limited- term license to host, copy, transmit and display Your Data, and any Non-Salesbox CRM Applications and program code created by or for You using a Service, as necessary for Us to provide the Services in accordance with this Agreement. Subject to the limited licenses granted herein, We acquire no right, title or interest from You or Your licensors under this Agreement in or to Your Data or any Non-Salesbox CRM Application or program code.</p>
               <p> 7.4. License by You to Use Feedback. You grant to Us and Our Affiliates a worldwide, perpetual, irrevocable, royalty-free license to use and incorporate into the Services any suggestion, enhancement request, recommendation, correction or other feedback provided by You or Users relating to the operation of the Services.</p>
               <p> 7.5. Federal Government End Use Provisions. We provide the Services, including related software and technology, for ultimate federal government end use solely in accordance with the following: Government technical data and software rights related to the Service include only those rights customarily provided to the public as defined in this Agreement. This customary commercial license is provided in accordance with FAR 12.211 (Technical Data) and FAR 12.212 (Software) and, for Department of Defense transactions, DFAR 252.227-7015 (Technical Data – Commercial Items) and DFAR 227.7202-3 (Rights in Commercial Computer Software or Computer Software Documentation). If a government agency has a need for rights not granted under these terms, it must negotiate with Us to determine if there are acceptable terms for granting those rights, and a mutually acceptable written addendum specifically granting those rights must be included in any applicable agreement.</p>

               <b>8. CONFIDENTIALITY</b>
               <p> 8.1. Definition of Confidential Information. "Confidential Information" means all information disclosed by a party ("Disclosing Party") to the other party ("Receiving Party"), whether orally or in writing, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure. Your Confidential Information includes Your Business Data in explicit form. Your Business Data in anonymous form is not classified as confidential and can be used according to 4.6 ; Our Confidential Information includes the Service and Content; and Confidential Information of each party includes the terms and conditions of this Agreement and all Order Forms (including pricing), as well as business and marketing plans, technology and technical information, product plans and designs, and business processes disclosed by such party. However, Confidential Information does not include any information that (i) is or becomes generally known to the public without breach of any obligation owed to the Disclosing Party, (ii) was known to the Receiving Party prior to its disclosure by the Disclosing Party without breach of any obligation owed to the Disclosing Party, (iii) is received from a third party without breach of any obligation owed to the Disclosing Party, or (iv) was independently developed by the Receiving Party. (v) Your Data or Your Business Data in anonymised form.</p>
               <p> 8.2. Protection of Confidential Information. The Receiving Party will use the same degree of care that it uses to protect the confidentiality of its own confidential information of like kind (but not less than reasonable care) (i) not to use any Confidential Information of the Disclosing Party for any purpose outside the scope of this Agreement, and (ii) except as otherwise authorised by the Disclosing Party in writing, to limit access to Confidential Information of the Disclosing Party to those of its and its Affiliates' employees and contractors who need that access for purposes consistent with this Agreement and who have signed confidentiality agreements with the Receiving Party containing protections no less stringent than those herein. Neither party will disclose the terms of this Agreement or any Order Form to any third party other than its Affiliates, legal counsel and accountants without the other party's prior written consent, provided that a party that makes any such disclosure to its Affiliate, legal counsel or accountants will remain responsible for such Affiliate's, legal counsel's or accountant's compliance with this Section 8.2.</p>
               <p> 8.3. Compelled Disclosure. The Receiving Party may disclose Confidential Information of the Disclosing Party to the extent compelled by law to do so, provided the Receiving Party gives the Disclosing Party prior notice of the compelled disclosure (to the extent legally permitted) and reasonable assistance, at the Disclosing Party's cost, if the Disclosing Party wishes to contest the disclosure. If the Receiving Party is compelled by law to disclose the Disclosing Party's Confidential Information as part of a civil proceeding to which the Disclosing Party is a party, and the Disclosing Party is not contesting the disclosure, the Disclosing Party will reimburse the Receiving Party for its reasonable cost of compiling and providing secure access to that Confidential Information.</p>

               <b>9. REPRESENTATIONS, WARRANTIES, EXCLUSIVE REMEDIES AND DISCLAIMERS</b>
               <p> 9.1. Representations. Each party represents that it has validly entered into this Agreement and has the legal power to do so.</p>
               <p> 9.2. We warrant that we are the owner of the Service and that we have the necessary rights to the Service for granting the rights granted to You according to this Agreement.</p>
               <p> 9.3. Our responsibility for deviations in the Service is limited to what is stated above. You can thus not assert any claim against Us on the basis of deviations in the Service.</p>
               <p> 9.4. We do not take responsibility for any physical, psychological, relational or any other damage, loss of business, or any other claim that can arise due to the usage of the Service, either by You, Users or any Affiliate.</p>
               <p> 9.5. We shall not be liable for any undertaking by You towards the End User and You shall indemnify Us in case of claims being raised towards Us by any End User.</p>
               <p> 9.6. Our Warranties. We warrant that (a) this Agreement, the Order Forms and the Documentation accurately describe the applicable administrative, physical, and technical safeguards for protection of the security, confidentiality and integrity of Your Data, (b) the Purchased Service will perform materially in accordance with the applicable Documentation. For any breach of an above warranty, Your exclusive remedies are those described in Sections 12.3 (Termination) and 12.4 (Refund or Payment upon Termination).</p>
               <p> 9.7. Disclaimers. Except as expressly provided herein, neither party makes any warranty of any kind, whether express, implied, statutory or otherwise, and each party specifically disclaims all implied warranties, including any implied warranty of merchantability, fitness for a particular purpose or non-infringement, to the maximum extent permitted by applicable law. Content and beta services are provided "as is," exclusive of any warranty whatsoever. Each party disclaims all liability and indemnification obligations for any harm or damages caused by any third-party hosting providers.</p>

               <b>10. MUTUAL INDEMNIFICATION</b>
               <p> 10.1. Indemnification by Us. We will defend You against any claim, demand, suit or proceeding made or brought against You by a third party alleging that the use of a Purchased Service in accordance with this Agreement infringes or misappropriates such third party's intellectual property rights (a "Claim Against You"), and will indemnify You from any damages, attorney fees and costs finally awarded against You as a result of, or for amounts paid by You under a court-approved settlement of, a Claim Against You, provided You (a) promptly give Us written notice of the Claim Against You, (b) give Us sole control of the defense and settlement of the Claim Against You (except that We may not settle any Claim Against You unless it unconditionally releases You of all liability), and (c) give Us all reasonable assistance, at Our expense. If We receive information about an infringement or misappropriation claim related to a Service, We may in Our discretion and at no cost to You (i) modify the Service so that it no longer infringes or misappropriates, without breaching Our warranties under Section 9.2 (Our Warranties), (ii) obtain a license for Your continued use of that Service in accordance with this Agreement, or (iii) terminate Your subscriptions for that Service upon 30 days' written notice and refund You any prepaid fees covering the remainder of the term of the terminated subscriptions. The above defense and indemnification obligations do not apply to the extent a Claim Against You arises from Provided Contact Content, Public Content, Content, a Non-Salesbox CRM Application or Your breach of this Agreement.</p>
               <p> 10.2. Indemnification by You. You will defend Us against any claim, demand, suit or proceeding made or brought against Us by a third party alleging that Your Data, Provided Contact Content or Your use of the Service or Content in breach of this Agreement, infringes or misappropriates such third party's intellectual property rights or violates applicable law (a "Claim Against Us"), and will indemnify Us from any damages, attorney fees and costs finally awarded against Us as a result of, or for any amounts paid by Us under a court-approved settlement of, a Claim Against Us, provided We (a) promptly give You written notice of the Claim Against Us, (b) give You sole control of the defense and settlement of the Claim Against Us (except that You may not settle any Claim Against Us unless it unconditionally releases Us of all liability), and (c) give You all reasonable assistance, at Your expense.</p>
               <p> 10.3. Exclusive Remedy. This Section 10 states the indemnifying party's sole liability to, and the indemnified party's exclusive remedy against, the other party for any type of claim described in this Section 10.</p>

               <b>11. LIMITATION OF LIABILITY</b>
               <p> 11.1. We hold no liability towards You related to this Agreement or otherwise.</p>
               <p> 11.2. Any statement, condition or warranty, express or implied, as to the quality, merchantability, or suitability or fitness for any particular purpose of the Service is hereby excluded and We shall not be liable to You, User, Affiliate, the End User or to any other persons for loss or damage (whether direct or consequential) arising directly or indirectly in connection with the Service itself, the usage of the Service, any configuration of the Service, variation or enhancement thereof, and any documentation, marketing or training relating thereto.</p>
               <p> 11.3. We shall not be liable for any undertaking by You towards the End User and You shall indemnify Us in case of claims being raised towards Us by any End User.</p>
               <p> 11.4. Limitation of Liability. Neither party's liability with respect to any single incident arising out of or related to this agreement will exceed the amount paid by customer hereunder in the 1 month preceding the incident, provided that in no event will either party's aggregate liability arising out of or related to this agreement exceed the total amount paid by customer hereunder. The above limitations will apply whether an action is in contract or tort and regardless of the theory of liability. However, the above limitations will not limit customer's payment obligations under section 6 (fees and payment for purchased services).</p>
               <p> 11.5. Exclusion of Consequential and Related Damages. In no event will either party have any liability to the other party for any lost profits, revenues or indirect, special, incidental, consequential, cover or punitive damages, whether an action is in contract or tort and regardless of the theory of liability, even if a party has been advised of the possibility of such damages. The foregoing disclaimer will not apply to the extent prohibited by law.</p>

               <b>12. TERM AND TERMINATION</b>
               <p> 12.1. Term of Agreement. This Agreement commences on the date You first accept it and continues until all subscriptions hereunder have expired or have been terminated.</p>
               <p> 12.2. Term of Purchased Subscriptions. The term of each subscription shall be as specified in the applicable Order Form. Except as otherwise specified in an Order Form, subscriptions will automatically renew for an additional subscription period, unless either party gives the other notice of non-renewal at least 30 days before the end of the relevant subscription period. The per-unit pricing during any automatic renewal term will be the same as that during the immediately prior term unless We have given You written notice of a pricing increase at least 30 days before the end of that prior term, in which case the pricing increase will be effective upon renewal and thereafter.</p>
               <p> 12.3. Termination. A party may terminate this Agreement for cause (i) upon 30 days written notice to the other party of a material breach if such breach remains uncured at the expiration of such period, or (ii) if the other party becomes the subject of a petition in bankruptcy or any other proceeding relating to insolvency, receivership, liquidation or assignment for the benefit of creditors.</p>
               <p> 12.4. Refund or Payment upon Termination. If this Agreement is terminated by You in accordance with Section 12.3 (Termination), We will refund You any prepaid fees covering the remainder of the term of all Order Forms after the effective date of termination. If this Agreement is terminated by Us in accordance with Section 12.3, You will pay any unpaid fees covering the remainder of the term of all Order Forms. In no event will termination relieve You of Your obligation to pay any fees payable to Us for the period prior to the effective date of termination. We do not pay You any Refund on any remainder of the term upon Termination, in any other scenario than stated above.</p>
               <p> 12.5. Your Data Portability and Deletion. Upon request by You made within 30 days after the effective date of termination or expiration of this Agreement, We will make Your Data available to You for export. After that 30-day period, We will have no obligation to maintain or provide Your Data. We will have the right to keep Your Data for use according to 4.6.</p>
               <p> 12.6. Surviving Provisions. The Sections titled "Fees and Payment for Purchase Services,""Proprietary Rights and Licenses,""Confidentiality,""Disclaimers,""Mutual Indemnification,""Limitation of Liability,""Refund or Payment upon Termination,""Portability and Deletion of Your Data,""Who You Are Contracting With, Notices, Governing Law and Jurisdiction," and "General Provisions" will survive any termination or expiration if this Agreement.</p>

               <b>13. WHO YOU ARE CONTRACTING WITH, NOTICES, GOVERNING LAW AND JURISDICTION</b>
               <p> 13.1. General. Who You are contracting with under this Agreement, who You should direct notices to under this Agreement, what law will apply in any lawsuit arising out of or in connection with this Agreement, and which courts have jurisdiction over any such lawsuit, depend on where You are domiciled.</p>

               <p>If You are domiciled in: Any country.</p>
               <p>You are contracting with: Salesbox CRM - System AB.</p>
               <p>Notices should be addressed to: Tysta gatan 4 SE115 20 Stockholm.</p>
               <p>The governing law is: Sweden.</p>
               <p>The courts having exclusive jurisdiction are: Sweden.</p>

               <p>13.2. Manner of Giving Notice. Except as otherwise specified in this Agreement, all notices, permissions and approvals hereunder shall be in writing and shall be deemed to have been given upon: (i) personal delivery, (ii) the second business day after mailing, (iii) the second business day after sending by confirmed facsimile, or (iv) the first business day after sending by email (provided email shall not be sufficient for notices of termination or an indemnifiable claim). Billing-related notices to You shall be addressed to the relevant billing contact designated by You. All other notices to You shall be addressed to the relevant Services system administrator designated by You.</p>
               <p>13.3. Agreement to Governing Law and Jurisdiction. Each party agrees to the applicable governing law above without regard to choice or conflicts of law rules, and to the exclusive jurisdiction of the applicable courts above.</p>

               <b>14. GENERAL PROVISIONS</b>
               <p>14.1. Export Compliance. The Service, Content, other technology We make available, and derivatives thereof may be subject to export laws and regulations of Sweden and other jurisdictions. Each party represents that it is not named on any Swedish government denied-party list.</p>
               <p>14.2. Anti-Corruption. You have not received or been offered any illegal or improper bribe, kickback, payment, gift, or thing of value from any of Our employees or agents in connection with this Agreement. Reasonable gifts and entertainment provided in the ordinary course of business do not violate the above restriction. If You learn of any violation of the above restriction, You will use reasonable efforts to promptly notify Us at info@salesboxcrm.com.</p>
               <p>14.3. Entire Agreement and Order of Precedence. This Agreement is the entire agreement between You and Us regarding Your use of the Service and Content and supersedes all prior and contemporaneous agreements, proposals or representations, written or oral, concerning its subject matter. No modification, amendment, or waiver of any provision of this Agreement will be effective unless in writing and signed by the party against whom the modification, amendment or waiver is to be asserted. The parties agree that any term or condition stated in Your purchase order or in any other of Your order documentation (excluding Order Forms) is void. In the event of any conflict or inconsistency among the following documents, the order of precedence shall be: (1) the applicable Order Form, (2) this Agreement, and (3) the Documentation.</p>
               <p>14.4. Assignment. Neither party may assign any of its rights or obligations hereunder, whether by operation of law or otherwise, without the other party's prior written consent (not to be unreasonably withheld); provided, however, either party may assign this Agreement in its entirety (including all Order Forms), without the other party's consent to its Affiliate or in connection with a merger, acquisition, corporate reorganisation, or sale of all or substantially all of its assets. Notwithstanding the foregoing, if a party is acquired by, sells substantially all of its assets to, or undergoes a change of control in favour of, a direct competitor of the other party, then such other party may terminate this Agreement upon written notice. In the event of such a termination, We will refund to You any prepaid fees covering the remainder of the term of all subscriptions. Subject to the foregoing, this Agreement will bind and inure to the benefit of the parties, their respective successors and permitted assigns.</p>
               <p>14.5. Relationship of the Parties. The parties are independent contractors. This Agreement does not create a partnership, franchise, joint venture, agency, fiduciary or employment relationship between the parties.</p>
               <p>14.6. Waiver. No failure or delay by either party in exercising any right under this Agreement will constitute a waiver of that right.</p>
               <p>14.7. Severability. If any provision of this Agreement is held by a court of competent jurisdiction to be contrary to law, the provision will be deemed null and void, and the remaining provisions of this Agreement will remain in effect.</p>

               <b>15. Reselling the Service from the Service</b>
               <p>15.1. As a paying user of the Service You have the right to recruit new End Users of the Service through and only through the Service.</p>
               <p>15.2. The Service retails as a monthly subscription. The subscription fee is stated excluding VAT and any local fees or taxes or charges. The subscription fee paid by a recruited End User is paid 1 subscription period ahead as an upfront payment. If the End User ends the subscription during an ongoing period, the contract is still valid until the subscription period has ended. Neither the End User nor You can claim any refund from Us on any remaining period of time of a contracted subscription period.</p>
               <p>15.3. We have the right to give away any number of free users without the right to commission for You. We also have the right to freely state the length of any trial period.</p>
               <p>15.4. We have the right to, at any given time, change the subscription fee or potential Trial periods without any notice. You do not have any right to claim any notification by Us before such changes.</p>
               <p>15.5. For each paying End User Subscription concluded directly by You, You are entitled to a commission of 10 % of the retail price unless it is being sold to an End User within an area exclusive to a Partner to Us, then the commission is zero.</p>
               <p>15.6. 90 % of the retail price paid by a recruited new End User is paid directly to Us. This is regardless if:</p>
               <p>-You have sold the End User subscription</p>
               <p>-The sold Service was inside an area exclusive to a Partner to Us</p>
               <p>15.7. We do not pay any extra commission to third parties. If a conflicting situation arises between who has the right to commission for an End User, between You and a Partner to Us, We have the single right to decide who is entitled to the commission without the right for You or the Partner to appeal the decision. We will never be held accountable, by You or a Partner to Us, for any claims connected to lost revenue or profit due to the fact that a conflicting situation between You and a Partner to Us arise.</p>
               <p>15.8. We have the right to sell anything directly to an already existing End-User or other End User recruited by You.</p>
               <p>15.9. Any right to any commission according to this Agreement is exclusive to You and cannot be transferred to any other party, individual or company.</p>
               <p>15.10. The commission is paid directly from the End User to the by You specified credit card information in the Service. The commission is paid upfront, after any given trial period has ended, on a yearly basis and continues to be paid out as long as both you and the End User remains paying users for the Service. If the End User or you end the subscription of the Service You are not entitled to any commission for that specific End User. If You terminate or end the subscription of the Service the right to any commission ends for all concluded End Users recruited by You. Any future subscription fees will automatically transfer to Us. You are entitled to keep any already paid out commission.</p>

               <b>16. GDPR</b>
               <p>16.1. You are free to enter any Content about persons to the Service but We do not take any responsibility for what type of Data You add to the Service and cannot be held responsible or liable in any way besides what is being stated in this Agreement.</p>
               <p>16.2. You are the sole responsible party to follow the GDPR legislation regarding what Data You choose to add to the Service.</p>
               <p>16.3. To comply with GDPR rules inside EU We warrant that when Content about a person is deleted from the Service We delete all data about the person that can be classified as personal such as, but not limited to, phone number, email, notes, information in custom fields, connected active/upcoming objects in the system such as, but not limited to, Tasks, Unqualified deals, Qualified deals, Appointments. If the person was connected to a company in the Service We keep the name of the person to display on any historic activity or business performed on that company.</p>
               <p>16.4. To comply with GDPR rules inside EU We warrant to only store Your data, Your business data inside EU.</p>
               <p>16.5. To comply with GDPR rules inside EU We warrant that You can export Your data from the Service.</p>
               <p>16.6. You can audit Your data at any time inside the Service. If any other type of audit is requested it has to be requested by You, in writing, with 90 days notice period. We do not warrant such an audit request will be approved. If a requested audit is approved by Us, You will solely bare any costs derived to such audit.</p>

             </div>
          }
        </Modal.Content>
        <Modal.Actions className={css.action}>
          <Button onClick={isSignupPage ? handleToUModalClose : onCloseTermOfUse}>Close</Button>
          {/* <Button primary onClick={handleToUModalAccept}>Accept</Button> */}
        </Modal.Actions>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {

  }
};
const mapDispatchToProps = {
  signUpToUClose: authActions.signUpToUClose,
  signUpToUAccept: authActions.signUpToUAccept,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withHandlers({
    handleToUModalClose: ({ signUpToUClose }) => (event, { }) => {
      signUpToUClose();
    },
    handleToUModalAccept: ({ signUpToUAccept }) => (event, { }) => {
      signUpToUAccept();
    },
  }),
)(TermOfUseModal);
