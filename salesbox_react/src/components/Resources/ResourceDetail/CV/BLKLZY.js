import React from 'react';
// import moment from 'moment';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import Open_Sans from "../../../../font/Open_Sans/OpenSans-Regular.ttf"
import Open_Sans_Bold from "../../../../font/Open_Sans/OpenSans-Bold.ttf"
import logo from '../../../../../public/001.png';
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
  page: {backgroundColor: 'white', fontSize: 10, fontFamily: "Open_Sans"},
  section: { color: 'white', textAlign: 'center', margin: 30 },
  leftH: {width: "30%", alignItems: 'center'},
  centerH: {width: "40%", textAlign: 'center'},
  rightH: {width: "30%", textAlign: 'center'},
  nameH: {textAlign: 'center', fontWeight: '400', fontSize: '25'},
  textCenter: {textAlign: 'center'},
  avatar: { width: "300px", height: "300px" },
  avatarC: {padding: "40px 20px"},
  bulletPoint: {
    width: 5,
    height: 5,
    backgroundColor: "#000",
    fontSize: 20,
    marginRight: "10",
    marginTop: "4"
  },
  inline: {flexDirection: 'row'},
  consultantN: {textAlign: 'center', fontSize: '30', marginTop: '20'},
  newspaper: {
    flexDirection: 'row',
    paddingLeft: "20%"
  },
  section: {
    width: "40%",
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  header: { marginBottom: '50'},
  textHighlight: { fontSize: '20' },
  nameHighlight: {fontSize: '50', maxLines: "2"},
  consultant: {width: '300', textAlign: 'center', fontSize: '30', margin: '10px 0'},
  row: {flexDirection: 'row', margin: '10px 0'},
  col4One: {width: '20%'},
  col4Two: {width: '40%', padding: '5px'},
  col4Three: {width: '20%'},
  col4Four: {width: '20%'},
  col3One: {width: '20%'},
  col3Two: {width: '40%', padding: '5px'},
  col3Three: {width: '40%'},
  fontBold: {fontFamily: "Open_Sans_Bold"},
  titlePage3: {width: '20%', textTransform: 'uppercase'},
  footer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 15,
    right: 0,
    paddingRight: 36,
  },
});

const BLKLZY = ({
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
      <View style={styles.header} fixed>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.leftH}>
          <Image style={{height: 15, width: 30}}
            src={logo}
          />
        </View>
        <View fixed style={styles.centerH}>
          <Text>CV</Text>
          <Text style={styles.fontBold}>{`${profileDetail?.firstName} ${profileDetail?.lastName}`}</Text>
        </View>
        <Text style={styles.rightH} render={({ pageNumber, totalPages }) => (
          `Sida: ${pageNumber} / ${totalPages}`
        )} fixed />
      </View>
      </View>
      
      <Text style={styles.nameHighlight} >{`${profileDetail?.firstName} ${profileDetail?.lastName}`}</Text>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.avatar}>
            <Image style={{height: "100%"}} cache={false} source={{ uri: profileDetail?.avatar ? `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${profileDetail?.avatar.substr(profileDetail?.avatar.length - 3)}/${profileDetail?.avatar}` : userLogo, method: "GET", headers: { "Cache-Control": "no-cache" } }}></Image>
  
        </View>
        <View style={styles.avatarC}>
          {competenceCheck?.length > 0 ?
            <>
              <View style={{margin: "20px 0"}}>
                <Text style={styles.textHighlight}>{header ? header : _l`Competences`}</Text>
                {competenceCheck.map((item) => {
                  return (
                    <View style={styles.inline}>
                      <Text style={styles.bulletPoint}></Text>
                      <Text style={styles.fontBold}>{item.competenceName}</Text>
                    </View>
                  )
                })}
              </View>
            </> : null 
          }
          <View>
          {experienceCheck?.length > 0 ? <>
        	<Text style={styles.textHighlight}>{_l`Key assignments`}</Text>
            {experienceCheck.map((item, index) => {
                return index < 5 ? (
                  <View style={styles.inline}>
                  <Text style={styles.bulletPoint}></Text>
                  <Text style={styles.fontBold}>{`${item.title}/ ${item.company}`}</Text>
                </View> ) : null
              })}
            </> : null }
          	</View>
        </View>
      </View>
      <Text style={styles.consultant}>{title || profileDetail?.title}</Text>
      	<View style={styles.newspaper}>
            <View style={styles.section}>
              <Text>{description?.substring(0, 400) || profileDetail?.profileDescription?.substring(0, 400)}</Text>
            </View>
            <View style={styles.section}>
              <Text>{description?.substring(400, description?.length) || profileDetail?.profileDescription?.substring(400, profileDetail?.profileDescription?.length)}</Text>
            </View>
        </View>
    </Page>
    <Page size="A4" style={styles.page}>
      <View style={styles.header} fixed>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.leftH}>
          <Image style={{height: 15, width: 30}}
            src={logo}
          />
        </View>
        <View fixed style={styles.centerH}>
          <Text>CV</Text>
          <Text style={styles.fontBold}>{`${profileDetail?.firstName} ${profileDetail?.lastName}`}</Text>
        </View>
        <Text style={styles.rightH} render={({ pageNumber, totalPages }) => (
          `Sida: ${pageNumber} / ${totalPages}`
        )} fixed />
      </View>
      </View>
      {experienceList?.length > 0 ? (
        <>
          <Text style={styles.nameHighlight}>{_l`Client Assignments`}</Text>
          {experienceList.map((item, index) => {
          return (
            <View wrap={false}>
          <View style={styles.col4One}>
                <Text style={{fontFamily: "Open_Sans_Bold", fontSize: '18'}}>{item.company}</Text>
          </View>
          <View style={styles.row}>
          <View style={styles.col4One}>
              </View>  
              <View style={styles.col4Two}>
                  <Text>{item.description}</Text>
              </View> 
              <View style={styles.col4Three}>
                  <View style={{marginBottom: '20px'}}>
                    <Text style={{textTransform: "uppercase"}}>{`Role`}:</Text>
                    <Text style={styles.fontBold}>{item.title}</Text>
                </View>
                <View>
                  <Text style={{textTransform: "uppercase"}}>{_l`Period`}:</Text>
                  <Text style={styles.fontBold}> {moment(item.startDate).format('MMM YYYY')} - {item.endDate ? moment(item.endDate).format('MMM YYYY') : _l`Current`}</Text>
                </View>
              </View>
              <View style={styles.col4Four}>
                <Text>{_l`Competences`}</Text>
                {
                  item.competenceDTOList.map((com) => {
                      return (
                        <View style={styles.inline}>
                          <Text style={styles.bulletPoint}></Text>
                          <Text key={`exx-${com.uuid}`} style={styles.fontBold}>{com.competenceName}</Text>
                        </View>
                      )
                    })
                  }
              </View>
          </View>
          </View>
          )})}
          </>) : null 
      }
  	</Page>
  
  	<Page size="A4" style={styles.page}>
      <View style={styles.header} fixed>
        <View style={{flexDirection: 'row'}}>
          <View style={styles.leftH}>
            <Image style={{height: 15, width: 30}}
              src={logo}
            />
          </View>
          <View style={styles.centerH}>
            <Text>CV</Text>
            <Text style={styles.fontBold}>{`${profileDetail?.firstName} ${profileDetail?.lastName}`}</Text>
          </View>
          <Text style={styles.rightH} render={({ pageNumber, totalPages }) => (
            `Sida: ${pageNumber} / ${totalPages}`
          )} fixed/>
        </View>
      </View>
      {listEmployee?.length > 0 ? (
        <View>
            <Text style={styles.titlePage3}>{_l`Employer`}</Text>
            {listEmployee.map((item, index) => (
            <View style={styles.row} wrap={false}>
              <View style={styles.col3One}>
              </View>  
                <View style={styles.col3Two}>
                    <Text style={styles.fontBold}>{item.name}</Text>
                </View> 
                <View style={styles.col3Three}>
                    <Text>{item.startYear} - {item.endYear}</Text>
                </View>
            </View>
            ))}
        </View>
      ) : null }

      {listEducation?.length > 0 ? (
        <View>
            <Text style={styles.titlePage3}>{_l`Education`}</Text>
            {listEducation.map((item, index) => (
            <View style={styles.row} wrap={false}>
              <View style={styles.col4One}>
              </View>  
                <View style={styles.col4Two}>
                    <Text style={styles.fontBold}>{item.school ? `${item.name} - ${item.school}` : item.name}</Text>
                </View> 
                <View style={styles.col4Three}>
                    <Text>{item.startYear} - {item.endYear}</Text>
                </View>
                <View style={styles.col4Four}>
                </View>
            </View>
            ))}
        </View>
      ) : null }

      {listCertificate?.length > 0 ? (
        <View>
            <Text style={styles.titlePage3}>{_l`Courses and Certificates`}</Text>
            {listCertificate.map((item, index) => (
            <View style={styles.row} wrap={false}>
              <View style={styles.col4One}>
              </View>  
                <View style={styles.col4Two}>
                    <Text style={styles.fontBold}>{item.name}</Text>
                </View> 
                <View style={styles.col4Three}>
                    <Text>{item.year}</Text>
                </View>
                <View style={styles.col4Four}>
                </View>
            </View>
            ))}
        </View>
      ) : null }

      {listLanguage?.length > 0 ? (
        <View>
            <Text style={styles.titlePage3}>{_l`Language`}</Text>
            {listLanguage.map((item, index) => (
            <View style={styles.row} wrap={false}>
              <View style={styles.col4One}>
              </View>  
                <View style={styles.col4Two}>
                    <Text style={styles.fontBold}>{item.name}</Text>
                </View> 
                <View style={styles.col4Three}>
                    <Text>{translateValueLeveLang(item.level)}</Text>
                </View>
                <View style={styles.col4Four}>
                </View>
            </View>
            ))}
        </View>
      ) : null }
  
      <View style={styles.footer}>
        <View>
        	<Text style={{textTransform: "uppercase"}}>{_l`Sales contact`}:</Text>
        </View>
        <View style={{paddingLeft: '40'}}>
        	<Text style={{padding: "20 0", fontFamily: "Open_Sans_Bold"}}>{user?.name}</Text>
          	<Text>{_l`Write`}: {user?.phone}</Text>
          	<Text>{_l`Talk`}: {user?.email}</Text>
        </View>
    	</View>
  	</Page>
  </Document>
  );
}

export default BLKLZY;
