import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ModalCommon from '../../../ModalCommon/ModalCommon';
import styles from './CreateCV.css';
import user from '../../../../../public/userGray.png';
import { Table } from 'semantic-ui-react';
import { filter } from 'lodash';
import { saveAs } from 'file-saver';
import moment from 'moment';
// import de from 'moment/locale/de';
// import sv from 'moment/locale/sv';
// import es from 'moment/locale/es';
// import en from 'moment/locale/en-ie';
import {Endpoints, ENTERPRISE_CV, TYPE_EXPORT_CV } from '../../../../Constants';
const messages = require('../../../../resources/messages.json');
import PreviewPDF from './PreviewPDF';
import { pdf } from '@react-pdf/renderer'
import ModalSendEmailAddDeal from '../ModalSendEmailAddDeal';
import * as NotificationActions from 'components/Notification/notification.actions';
import api from 'lib/apiClient';
import createTranslator from 'oxygen-i18n/lib/createTranslator';
import BLKLZY from './BLKLZY';
// import { getCurrentTimeZone } from '../../../../lib/dateTimeService';

const i18n = createTranslator({}, (translator) => {
  try {
    translator.addMessages(messages);
  } catch (e) {
  }
});
const _l = i18n.translate;
const CreateCV = ({
	visible,
	profileDetail,
	experienceList,
	listEmployee,
	listEducation,
	listCertificate,
	listLanguage,
	competenceDTOList,
  setVisibleCV,
  users,
  userId,
  header,
  company,
  currentVersion,
  accountAllowedSendEmail,
  showInfo,
  singleCvDTO,
  setSingleCvDTO,
  title,
  description,
  enterpriseID
}) => {
  let competenceCheck = filter(competenceDTOList, ['checked', true]);
  let experienceCheck = filter(experienceList, ['reference', true]);
  let experienceFilter = experienceList.filter((f) => f.checked !== false)
  const [isShowMassPersonalEmail, showHideMassPersonalMail] = useState(false);
  const [fileAttachSendMail, setFileAcctachSendMail] = useState([])
  let CvContainer = enterpriseID === ENTERPRISE_CV ? BLKLZY : PreviewPDF;
  const PdfContainer = <CvContainer title={title} description={description} _l={_l} company={company} user={users[userId]} profileDetail={profileDetail}
  competenceCheck={competenceCheck} experienceCheck={experienceCheck} header={header}
  experienceList={experienceFilter} listEmployee={listEmployee} listEducation={listEducation}
  listLanguage={listLanguage} listCertificate={listCertificate} moment={moment}/>


  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const getCurrentTimeZone = () => {
    let timeZone = new Date().getTimezoneOffset() / (-60);
    if(timeZone > 0) return '+' + timeZone;
    return timezone;

  };
  const getDocx = async () => {
    try {
      const rs = await api.post({
        resource: `${Endpoints.Resource}/resource/cv/exportWordCv`,
        query: {
          timeZone: getCurrentTimeZone(),
        },
        data: {
            ...singleCvDTO,
            cvCompetenceList: competenceCheck.map((item) => {
              return {
                "uuid": null,
                "cvId": null,
                "resourceCompetenceId": item.resourceCompetenceId,
                "competenceId": item.competenceId,
                "competenceName": item.competenceName,
                "competenceLevel": item.competenceLevel,
                "lastUsed": item.lastUsed,
                "checked": item.checked
              }
            }),
            cvExperienceList: experienceList
          },
        options: {
          responseType: 'blob',
        }
      })
      return rs;
    }catch(ex){}
  }

  const handleExport = async (type) => {
    setIsDownloading(true);
    let asPdf = pdf([]);
    asPdf.updateContainer(PdfContainer);
    const blob = await asPdf.toBlob();
    switch (type) {

      case TYPE_EXPORT_CV.PDF:
        saveAs(blob, `${profileDetail?.firstName} ${profileDetail?.lastName}, ${company?.name} - CV ${_l.call(this, [currentVersion])}.pdf`)
      break;
      case TYPE_EXPORT_CV.WORD:
        let docx = await getDocx();
        saveAs(docx, `${profileDetail?.firstName} ${profileDetail?.lastName}, ${company?.name} - CV [${currentVersion}].docx`)
      break;
    }
    setIsDownloading(false);
  }

  const handleSend = async (type) => {
    if(!accountAllowedSendEmail) {
      showInfo(`You need to connect an Office365 or Gmail account to Salesbox first`, 'Info');
      return;
    }
    setIsSending(true);
    let file;
    switch(type) {
      case TYPE_EXPORT_CV.PDF:
        let asPdf = pdf([]);
        asPdf.updateContainer(PdfContainer);
        let blob = await asPdf.toBlob();
        file = new File([blob], `${profileDetail?.firstName} ${profileDetail?.lastName}, ${company?.name} - CV [${currentVersion}].pdf`);

        break;
      case TYPE_EXPORT_CV.WORD:
        let docx = await getDocx();
        file = new File([docx], `${profileDetail?.firstName} ${profileDetail?.lastName}, ${company?.name} - CV [${currentVersion}].docx`);
        break;
    }
    setIsSending(false);
    setFileAcctachSendMail([file])
    showHideMassPersonalMail(true);
  }
  const translateValueLeveLang = (level) => {
    switch(level) {
      case 'GOOD':
        return _l`Good`;
      case 'NATIVE':
        return _l`Native`;
      case 'FLUENT':
        return _l`Fluent`;
      case 'BASIC':
        return _l`Basic`;
    }
  }

  useEffect(() => {
    let langVersion = 'se';
    switch (currentVersion) {
      case 'Sweden':
        langVersion = 'se';
        // moment.locale('sv', sv);
        break;
      case 'United Kingdom':
        langVersion = 'en-US';
        // moment.locale("en-ie", en);
        break;
      case 'Germany':
        langVersion = 'de';
        // moment.locale(langVersion, de);
        break;
      case 'Spain':
        langVersion = 'es';
        // moment.locale(langVersion, es);
        break;
      default:
        langVersion = 'se';
        // moment.locale('sv', sv);
        break;
     }
     setSingleCvDTO((state) => ({
      ...state,
      language: langVersion === "en-US" ? "en" : langVersion
    }))
     i18n.setLocale(langVersion);
  }, [currentVersion])

	return (
		<>
		<ModalCommon
      visible={visible}
			title={_l`Preview CV`}
			onClose={()=> {setVisibleCV(false)}}
      onDownload={handleExport}
      handleSend = {handleSend}
      hasNotFooter = {true}
      isPreviewCV= {true}
      isSending={isSending}
      isDownloading={isDownloading}
		>
      {/* <PreviewPDF company={company} user={users[userId]} profileDetail={profileDetail} /> */}

			<div className={styles.previewCVContainer}>
			<div className={styles.previewCV} id="previewCV">
				<div className={styles.PCHeader}>
					<div className={styles.PCHLeft}>
            <span>{company?.name}</span>
          </div>
					<div className={styles.PCHRight}>
						<div><b>{users[userId]?.name}</b></div>
						<div>{users[userId]?.email}</div>
						<div>{users[userId]?.phone}</div>
					</div>
				</div>
				<div className={styles.PCInfoName}>
					<div className={styles.PCAvatar}>
						<img src={profileDetail?.avatar ? `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${profileDetail?.avatar.substr(profileDetail?.avatar.length - 3)}/${profileDetail?.avatar}` : user}/>
					</div>
					<div className={styles.PCName}>
						<div>{`${profileDetail?.firstName} ${profileDetail?.lastName}`}</div>
						<div>{title || profileDetail?.title}</div>
					</div>
				</div>
				<div className={styles.PCDesc}>
					<div>{description || profileDetail?.profileDescription}</div>
					<div className={styles.PCListCompetences}>
						{ competenceCheck?.length > 0 ?
						<>
						<span className={styles.PCTitle}>{header ? header : _l`Competences`}</span>
						<ul>
							{competenceCheck.map((item) => {
								return (
									<li key={item.uuid}>{item.competenceName}</li>
								)
							})}
						</ul>
						</>
						: null
					}

					</div>
				</div>
				<div>
				{experienceCheck?.length > 0 ?
				<>
					<div className={styles.PCGroupHeader}>{_l`Highlinghted Experiences`}</div>
						{experienceCheck.map((item) => {
							return(
								<div className={styles.PCEF} key={item.uuid}>
								<div className={styles.PCEFTitle}>{item.title}</div>
								<div className={styles.PCEFTime}>{item.company} | {moment(item.startDate).format('DD MMM YYYY')} - {moment(item.endDate).format('DD MMM YYYY')}</div>
								<div className={styles.PCEFDesc}>{item.description}</div>
								<div className={styles.PCERListSpecial}>
									{
										item.competenceDTOList.map((com) => {
											return (
												<span key={com.uuid}>{com.competenceName}</span>
											)
										})
									}
								</div>
								</div>
							)
						})}
				</> : null
			}
			</div>

          {experienceFilter?.length > 0 ? (
            <div className={styles.PCExperience}>
              <div className={styles.PCHeaderGroup}>{_l`Experiences_printed_CV`}</div>
              {experienceFilter.map((item) => {
                return (
                  <div className={styles.PCEContainer} key={`ex-${item.uuid}`}>
                    <div className={styles.PCELeft}>
                      <div className={styles.PCELeftTime}>
                        {moment(item.startDate).format('DD MMM YYYY')} - {item.endDate ? moment(item.endDate).format('DD MMM YYYY') : _l`Current`}
                      <p>{item.location}</p>
                      </div>
                    </div>
                    <div className={styles.PCERight}>
                      <div className={styles.PCERTitle}>{item.title}</div>
                      <div className={styles.PCERCompany}>{item.company}</div>
                      <div className={styles.PCERDesc}>{item.description}</div>
                      <div className={styles.PCERListSpecial}>
                        {item.competenceDTOList.map((com) => {
                          return <span key={`exx-${com.uuid}`}>{com.competenceName}</span>;
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {listEmployee?.length > 0 ? (
            <div className={styles.PCEmployees}>
              <div className={styles.PCHeaderGroup}>{_l`Employers`}</div>
              <div className={styles.PCEmployee}>
                <Table striped basic="very" className={styles.PCTable}>
                  <Table.Body>
                    {listEmployee.map((item, index) => {
                      return (
                        <Table.Row key={index}>
                          <Table.Cell width="8">{item.name}</Table.Cell>
                          <Table.Cell width="8" textAlign="right">
                            {item.startYear} - {item.endYear}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </div>
            </div>
          ) : null}

          {listEducation?.length > 0 ? (
            <div className={styles.PCEmployees}>
              <div className={styles.PCHeaderGroup}>{_l`Educations`}</div>
              <div className={styles.PCEmployee}>
                <Table striped basic="very" className={styles.PCTable}>
                  <Table.Body>
                    {listEducation.map((item, index) => {
                      return (
                        <Table.Row key={index}>
                          <Table.Cell width="8">{item.school ? `${item.name} - ${item.school}` :  item.name}</Table.Cell>
                          <Table.Cell width="8" textAlign="right">
                            {item.startYear} - {item.endYear}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </div>
            </div>
          ) : null}

          {listCertificate?.length > 0 ? (
            <div className={styles.PCEmployees}>
              <div className={styles.PCHeaderGroup}>{_l`Certificates & courses`}</div>
              <div className={styles.PCEmployee}>
                <Table striped basic="very" className={styles.PCTable}>
                  <Table.Body>
                    {listCertificate.map((item, index) => {
                      return (
                        <Table.Row key={index}>
                          <Table.Cell width="8">{item.name}</Table.Cell>
                          <Table.Cell width="8" textAlign="right">
                            {item.year}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </div>
            </div>
          ) : null}

          {listLanguage?.length > 0 ? (
            <div className={styles.PCEmployees}>
              <div className={styles.PCHeaderGroup}>{_l`Languages`}</div>
              <div className={styles.PCEmployee}>
                <Table striped basic="very" className={styles.PCTable}>
                  <Table.Body>
                    {listLanguage.map((item, index) => {
                      return (
                        <Table.Row key={index}>
                          <Table.Cell width="8">{item.name}</Table.Cell>
                          <Table.Cell width="8" textAlign="right">
                            {translateValueLeveLang(item.level)}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      </ModalCommon>
      <ModalSendEmailAddDeal isModalSendCV={true} visible={isShowMassPersonalEmail} setVisible={showHideMassPersonalMail} fileAttach={fileAttachSendMail}/>
    </>
  );
};

const mapStateToProps = (state) => ({
  profileDetail: state.entities?.resources?.__DETAIL,
  conpetencesName: state.entities.resources.competencesName,
  competences: state.entities.resources.competences,
  experienceList: state.entities?.resources?.cv?.experienceList || [],
  company: state.auth?.company,
  users: state.entities?.user,
  accountAllowedSendEmail: state.common.accountAllowedSendEmail
});

const mapDispatchToProps = {
  showInfo: NotificationActions.info,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateCV);
