import React from 'react';
// import moment from 'moment';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import Open_Sans from "../../../../font/Open_Sans/OpenSans-Regular.ttf"
import Open_Sans_Bold from "../../../../font/Open_Sans/OpenSans-Bold.ttf"
import userLogo from '../../../../../public/userGray.png';
Font.register({
  family: 'Open_Sans',
  src: Open_Sans
})

Font.register({
  family: 'Open_Sans_Bold',
  src: Open_Sans_Bold
})
// Font.register({
//   family: 'Oswald',
//   src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
// });


const styles = StyleSheet.create({
  page: { padding: "30 30", color: "#757575", fontSize: 10, fontFamily: "Open_Sans"},
  section: { textAlign: 'center', margin: 30 },
  header: {
  	flexDirection: 'row',
    marginBottom: 20
  },
  left: {
    width: '60%',
  },
  right: {
    width: '40%',
    textAlign: "right"
  },
  company: {
    fontFamily: "Open_Sans_Bold",
    fontSize: "22",
    color: "black"
  },
  FRName: {
    fontFamily: "Open_Sans_Bold"
  },
  PCInfoName: {
    flexDirection: "row"
  },
  PCAvatar: {
    width: "100px", height: "100px"
  },
  PCAvatarImg: {
    borderTopLeftRadius: "100",
    borderTopRightRadius: "100",
    borderBottomRightRadius: "100",
    borderBottomLeftRadius: "100"
  },
   PCName: {
    alignSelf: "flex-end",
    marginLeft: "20",

    color: "#5e5e5e",
    fontWeight: "bold"
  },
  PCFName: {
    fontSize: "30",
  },
  RName: {
    fontWeight: "bold"
  },
  PCLName: {
    color: "black",
    fontSize: 20
  },
  PCDesc: { margin: "10px 0", flexDirection: 'row', },
  PCDescText: {width: '70%', color: "#606060", fontWeight: "thin" },
  PCListCompetences: {
    marginLeft : 40
  },
  item: {
    flexDirection: 'row',
    marginBottom: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  bulletPoint: {
    width: 5,
    height: 5,
    backgroundColor: "#000",
    fontSize: 20,
    marginRight: "10"
  },
  itemContent: {
    flex: 1,
  },
  PCGroupHeader: {
    fontSize: "16",
    borderBottom: "1 solid #5e5e5e",
    marginBottom: "20",
    paddingBottom: "5",
    color: "#5e5e5e",
    fontFamily: "Open_Sans_Bold",
  },
  PCGroupHeaderTable: {
    fontFamily: "Open_Sans_Bold",
    fontSize: "16",
    borderBottom: "1 solid #5e5e5e",
    paddingBottom: "5",
    color: "#5e5e5e",
    paddingTop: "15"
  },
  PCEFTitle: { fontFamily: "Open_Sans_Bold", fontSize: "15" },
  PCEFTime: { color: "gray", marginTop: "5px" },
  PCEFDesc: { color: "gray" },
  PCEContainer: {
    flexDirection: "row",
    margin: "10 0",
    breakInside: "avoid-page"
  },
  PCExperienceHl: {
    width: "70%"
  },
  PCExperience: { marginTop: '10' },
  PCELeft: { width: "40%" },
  PCERight: { width: "60%" },
  PCERTitle: { fontFamily: "Open_Sans_Bold", color: "#5e5e5e" },
  PCEF: { margin: "5px 0", breakInside: "avoid-page" },
  PCERListSpecial: {
    flexDirection: "row",
    flexWrap: "wrap"
  },
  PCERListSpecialSpan: {
    backgroundColor: "#f1f1f1",
    padding: "2px 8px",
    margin: "5px 5px 0 0",
    borderRadius: "20",
    color: "#6c6c6c"
  },
  PCTable: {
    flexDirection: "row",
    padding: "5 10"
  },
  PCTableLeft: {
    width: "60%"
  },
  PCTableRight: {
    width: "40%",
    textAlign: "right"
  },
  PCTitle: {
    fontFamily: "Open_Sans_Bold",
    color: "#5e5e5e"
  },
  bold: {
    fontFamily: "Open_Sans_Bold",
  },
  PCERCompany: {
    marginTop: '5px'
  }
});

const PreviewPDF = ({
  _l,
  profileDetail,
	company,
  user,
  competenceCheck,
  header,
  experienceCheck,
  experienceList,
  listEmployee,
  listEducation,
  listLanguage,
  listCertificate,
  moment,
  title,
  description
}) => {

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
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header} wrap={false}>
          <View style={styles.left}>
            <Text style={styles.company}>{company?.name}</Text>
          </View>
          <View style={styles.right}>
              <Text style={styles.FRName}>{user?.name}</Text>
              <Text>{user?.email}</Text>
              <Text>{user?.phone}</Text>
          </View>
        </View>
        <View style={styles.PCInfoName}>
          <View style={styles.PCAvatar}>
          <Image style={styles.PCAvatarImg} cache={false} source={{ uri: profileDetail?.avatar ? `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${profileDetail?.avatar.substr(profileDetail?.avatar.length - 3)}/${profileDetail?.avatar}` : userLogo, method: "GET", headers: { "Cache-Control": "no-cache" } }}></Image>
          </View>
          <View style={styles.PCName}>
                <Text style={[styles.bold, {fontSize: '16'}]}>{`${profileDetail?.firstName} ${profileDetail?.lastName}`}</Text>
                <Text style={{fontSize: '13', width: "80%" }}>{title || profileDetail?.title}</Text>
            </View>
        </View>
        <View style={styles.PCDesc}>
          <View style={styles.PCDescText}>
            <Text>{description || profileDetail?.profileDescription}</Text>
          </View>
          <View style={styles.PCListCompetences}>
            {competenceCheck?.length > 0 ?
              <>
              <Text style={styles.PCTitle}>{header ? header : _l`Competences`}</Text>
              {competenceCheck.map((item) => {
                return (
                  <View style={styles.item}>
                    <Text style={styles.bulletPoint}></Text>
                    <Text style={styles.itemContent}>{item.competenceName}</Text>
                  </View>
                )
              })}
            </>
            : null
          }
          </View>
        </View>
        {experienceCheck?.length > 0 ?
          <>
            <View style={styles.PCExperienceHl}>

              {experienceCheck.map((item, index) => {
                return (
                  <View style={styles.PCEF} key={item.uuid} wrap={false}>
                    { index === 0 ? <Text style={styles.PCGroupHeader}>{_l`Highlinghted Experiences`}</Text> : null }
                    <Text style={styles.PCEFTitle}>{item.title}</Text>
                    <Text style={styles.PCEFTime}>{`${item.company}  `}  |  {`  `}{moment(item.startDate).format('DD MMM YYYY')} - {item.endDate ? moment(item.endDate).format('DD MMM YYYY') : _l`Current`}</Text>
                    <Text style={styles.PCEFDesc}>{item.description}</Text>
                    <View style={styles.PCERListSpecial}>
                      {
                        item.competenceDTOList.map((com, index) => {
                          return (
                          <Text style={styles.PCERListSpecialSpan} key={`HE-${index}`}>{com.competenceName}</Text>
                          )
                        })
                      }
                    </View>
                </View>
                )
              })}
            </View>
          </>
        : null
        }

        {experienceList?.length > 0 ? (
          <>
            <View style={styles.PCExperience} >

            {experienceList.map((item, index) => {
              return (
                <View wrap={false}>
                { index === 0 ? <Text style={styles.PCGroupHeader}>{_l`Experiences_printed_CV`}</Text> : null }
                <View style={styles.PCEContainer} key={`ex-${item.uuid}`}>
                <View style={styles.PCELeft}>
                  <Text style={styles.PCELeftTime}>
                    {moment(item.startDate).format('DD MMM YYYY')} - {item.endDate ? moment(item.endDate).format('DD MMM YYYY') : _l`Current`}
                  </Text>
                  <Text>{item.location}</Text>
                </View>
                <View style={styles.PCERight}>
                  <Text style={styles.PCERTitle}>{item.title}</Text>
                  <Text style={styles.PCERCompany}>{item.company}</Text>
                  <Text style={styles.PCERDesc}>{item.description}</Text>
                  <View style={styles.PCERListSpecial}>
                    {
                      item.competenceDTOList.map((com) => {
                        return (
                        <Text key={`exx-${com.uuid}`} style={styles.PCERListSpecialSpan}>{com.competenceName}</Text>
                        )
                      })
                    }
                  </View>
                </View>
                </View>
                </View>
              )
            })}

            </View>
          </>
        ) : null}

        {listEmployee?.length > 0 ? (
          <>
            <View wrap={false}>
              <Text style={styles.PCGroupHeaderTable}>{_l`Employers`}</Text>
              {listEmployee.map((item, index) => {
                return (
                  <View key={`Em-${index}`} style={[styles.PCTable,  index % 2 === 0 ? { backgroundColor: "#F7F7F7"}: null]}>
                    <Text style={styles.PCTableLeft}>{item.name}</Text>
                    <Text style={styles.PCTableRight}>{item.startYear} - {item.endYear}</Text>
                  </View>
                )
              })}
            </View>
          </>
        ) : null }


        {listEducation?.length > 0 ? (
          <>
            <View wrap={false}>
              <Text style={styles.PCGroupHeaderTable}>{_l`Educations`}</Text>
              {listEducation.map((item, index) => {
                return (
                  <View key={`Ed-${index}`} style={[styles.PCTable,  index % 2 === 0 ? { backgroundColor: "#F7F7F7"}: null]}>
                    <Text style={styles.PCTableLeft}>{item.school ? `${item.name} - ${item.school}` : item.name}</Text>
                    <Text style={styles.PCTableRight}>{item.startYear} - {item.endYear}</Text>
                  </View>
                )
              })}
            </View>
          </>
        ) : null }

        {listCertificate?.length > 0 ? (
          <>
            <View wrap={false}>
              <Text style={styles.PCGroupHeaderTable}>{_l`Certificates & courses`}</Text>
              {listCertificate.map((item, index) => {
                return (
                  <View  key={`Cc-${index}`} style={[styles.PCTable,  index % 2 === 0 ? { backgroundColor: "#F7F7F7"}: null]}>
                    <Text style={styles.PCTableLeft}>{item.name}</Text>
                    <Text style={styles.PCTableRight}>{item.year}</Text>
                  </View>
                )
              })}
            </View>
          </>
        ) : null }

        {listLanguage?.length > 0 ? (
          <>
            <View wrap={false}>
              <Text style={styles.PCGroupHeaderTable}>{_l`Languages`}</Text>
              {listLanguage.map((item, index) => {
                return (
                  <View key={`lg-${index}`} style={[styles.PCTable,  index % 2 === 0 ? { backgroundColor: "#F7F7F7"}: null]}>
                    <Text style={styles.PCTableLeft}>{item.name}</Text>
                    <Text style={styles.PCTableRight}>{translateValueLeveLang(item.level)}</Text>
                  </View>
                )
              })}
            </View>
          </>
        ) : null }


      </Page>
    </Document>
  );
}

export default PreviewPDF;
