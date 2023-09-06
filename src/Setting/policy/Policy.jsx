import React from 'react'
import "./policy.scss";
import { useNavigate } from 'react-router-dom';
import { RxDotFilled } from "react-icons/rx"

const Policy = () => {

    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    return (
        <div className='policy-container bg-light_0 dark:bg-dark'>
            <div className="setting-back-div ">
                <i onClick={goBack} className="bi bi-arrow-left text-lightPostIcon dark:text-darkPostIcon setting-back"></i>
            </div>

            <div className='policy-box-sizing'>

                <div className="policy-containt-wrapper bg-lightDiv dark:bg-darkDiv text-lightPostText dark:darkPostText">

                    <div className="policy-containt-div">
                        <RxDotFilled className='policy-dot text-lightInput dark:text-dark' />
                        <div className="policy-containt-title">
                            User Behavior and Conduct
                        </div>
                    </div>

                    <div className="policy-subcontaint-div">
                        <div className="policy-subcontaint-title">
                            <RxDotFilled className='policy-dot-sm text-lightInput dark:text-dark' />
                            Respectful Communication
                        </div>
                        <div className="policy-subcontaint-detail">
                            Users of VChat App are expected to communicate with respect, kindness, and courtesy. Harassment, bullying, hate speech, or any form of offensive behavior will not be tolerated.
                        </div>
                    </div>
                    <div className="policy-subcontaint-div">
                        <div className="policy-subcontaint-title">
                            <RxDotFilled className='policy-dot-sm text-lightInput dark:text-dark' />
                            No Discrimination
                        </div>
                        <div className="policy-subcontaint-detail">
                            Discriminatory language or actions based on factors such as race, gender, religion, nationality, or sexual orientation are strictly prohibited.
                        </div>
                    </div>
                    <div className="policy-subcontaint-div">
                        <div className="policy-subcontaint-title">
                            <RxDotFilled className='policy-dot-sm text-lightInput dark:text-dark' />
                            User Safety
                        </div>
                        <div className="policy-subcontaint-detail">
                            Protect your personal information. Do not share sensitive data, financial details, or any information that could compromise your safety. Encouraging self-harm, violence, or any harmful activities is strictly forbidden.
                        </div>
                    </div>

                </div>


                <div className="policy-containt-wrapper bg-lightDiv dark:bg-darkDiv text-lightPostText dark:darkPostText">

                    <div className="policy-containt-div">
                        <RxDotFilled className='policy-dot text-lightInput dark:text-dark' />
                        <div className="policy-containt-title">
                            Content Sharing and Moderation
                        </div>
                    </div>

                    <div className="policy-subcontaint-div">
                        <div className="policy-subcontaint-title">
                            <RxDotFilled className='policy-dot-sm text-lightInput dark:text-dark' />
                            Appropriate Content
                        </div>
                        <div className="policy-subcontaint-detail">
                            All content shared on VChat App must be suitable for a diverse audience. Sharing explicit, violent, or offensive content is strictly prohibited.
                        </div>
                    </div>
                    <div className="policy-subcontaint-div">
                        <div className="policy-subcontaint-title">
                            <RxDotFilled className='policy-dot-sm text-lightInput dark:text-dark' />
                            Copyright and Intellectual Property
                        </div>
                        <div className="policy-subcontaint-detail">
                            Respect copyright laws. Only share content that you have the right to distribute. Unauthorized sharing of copyrighted material is not allowed.
                        </div>
                    </div>
                    <div className="policy-subcontaint-div">
                        <div className="policy-subcontaint-title">
                            <RxDotFilled className='policy-dot-sm text-lightInput dark:text-dark' />
                            Moderation
                        </div>
                        <div className="policy-subcontaint-detail">
                            VChat App administrators may monitor conversations for policy compliance. Inappropriate content may be removed, and users engaging in misconduct may face temporary or permanent account suspension.
                        </div>
                    </div>

                </div>


                <div className="policy-containt-wrapper bg-lightDiv dark:bg-darkDiv text-lightPostText dark:darkPostText">

                    <div className="policy-containt-div">
                        <RxDotFilled className='policy-dot text-lightInput dark:text-dark' />
                        <div className="policy-containt-title">
                            Privacy and Data Security
                        </div>
                    </div>

                    <div className="policy-subcontaint-div">
                        <div className="policy-subcontaint-title">
                            <RxDotFilled className='policy-dot-sm text-lightInput dark:text-dark' />
                            Data Privacy
                        </div>
                        <div className="policy-subcontaint-detail">
                            Your privacy matters. VChat App ensures the security of your personal information and chat content. We do not share your data with third parties unless required by law.
                        </div>
                    </div>
                    <div className="policy-subcontaint-div">
                        <div className="policy-subcontaint-title">
                            <RxDotFilled className='policy-dot-sm text-lightInput dark:text-dark' />
                            Reporting
                        </div>
                        <div className="policy-subcontaint-detail">
                            If you encounter any suspicious behavior or content, report it to our administrators. We take reports seriously and will take appropriate action.
                        </div>
                    </div>

                </div>

                <div className="policy-containt-wrapper bg-lightDiv dark:bg-darkDiv text-lightPostText dark:darkPostText">

                    <div className="policy-containt-div">
                        <RxDotFilled className='policy-dot text-lightInput dark:text-dark' />
                        <div className="policy-containt-title">
                            User Accounts and Access
                        </div>
                    </div>

                    <div className="policy-subcontaint-div">
                        <div className="policy-subcontaint-title">
                            <RxDotFilled className='policy-dot-sm text-lightInput dark:text-dark' />
                            Account Creation
                        </div>
                        <div className="policy-subcontaint-detail">
                            Create your account with accurate information. Impersonation or using fake accounts is not permitted.
                        </div>
                    </div>
                    <div className="policy-subcontaint-div">
                        <div className="policy-subcontaint-title">
                            <RxDotFilled className='policy-dot-sm text-lightInput dark:text-dark' />
                            Account Security
                        </div>
                        <div className="policy-subcontaint-detail">
                            Keep your account secure. Do not share your login details, and do not attempt to access others' accounts without permission.
                        </div>
                    </div>

                </div>


                <div className="policy-containt-wrapper bg-lightDiv dark:bg-darkDiv text-lightPostText dark:darkPostText">

                    <div className="policy-containt-div">
                        <RxDotFilled className='policy-dot text-lightInput dark:text-dark' />
                        <div className="policy-containt-title">
                            App Updates and Changes
                        </div>
                    </div>

                    <div className="policy-subcontaint-div">
                        <div className="policy-subcontaint-title">
                            <RxDotFilled className='policy-dot-sm text-lightInput dark:text-dark' />
                            Policy Updates
                        </div>
                        <div className="policy-subcontaint-detail">
                            VChat App policies may be updated periodically. Users will be notified of significant changes. Continued use of the app implies acceptance of the updated policies.
                        </div>
                    </div>

                </div>

                <div className="policy-containt-wrapper bg-lightDiv dark:bg-darkDiv text-lightPostText dark:darkPostText">

                    <div className="policy-containt-div">
                        <RxDotFilled className='policy-dot text-lightInput dark:text-dark' />
                        <div className="policy-containt-title">
                            Consequences of Violation
                        </div>
                    </div>

                    <div className="policy-subcontaint-div">
                        <div className="policy-subcontaint-title">
                            <RxDotFilled className='policy-dot-sm text-lightInput dark:text-dark' />
                            Violations
                        </div>
                        <div className="policy-subcontaint-detail">
                            Violating VChat App policies may result in warnings, temporary account suspension, or permanent banning, depending on the severity of the violation.
                        </div>
                    </div>

                    <div className="policy-subcontaint-div">
                        <div className="policy-subcontaint-title">
                            <RxDotFilled className='policy-dot-sm text-lightInput dark:text-dark' />
                            Appeals
                        </div>
                        <div className="policy-subcontaint-detail">
                            If you believe your account was suspended unfairly, you can appeal the decision to our administrators for review.

                            By using VChat App, you agree to adhere to the above policies. Failure to comply may result in appropriate actions taken against your account.
                        </div>
                    </div>

                </div>
            </div>


        </div>
    )
}

export default Policy