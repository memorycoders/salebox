import React, { Component, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Image, Input, Grid, GridColumn, GridRow, Button } from 'semantic-ui-react';
import _l from 'lib/i18n';
import css from './CompanyInfoPane.css';
import * as SettingActions from '../../settings.actions';
import CountryDropdown from '../../../Country/CountryDropdown';
import SizeDropdown from '../../../Size/SizeDropdown';
import { calculatingPositionMenuDropdown } from '../../../../Constants';
import CropPhotoModal from '../../UploadAvatar/CropPhotoModal';
import EmailPane from '../EmailPane';
import PhonePane from '../PhonePane';
import { isEurope, getCountryNameOptions } from 'lib/common';
import { checkVAT, countries } from 'jsvat';

export const CompanyInfoPane = (props) => {
  const { fetchCompanyInfoRequest, companyInfo, imageData } = props;
  const [validVat, setValidVat] = useState(false);

  const {
    additionalEmailList,
    additionalPhoneList,
    address,
    avatar,
    city,
    country,
    email,
    industry,
    name,
    postalCode,
    size,
    state,
    vat,
    vatPercent,
  } = companyInfo ? companyInfo : {};

  useEffect(() => {
    fetchCompanyInfoRequest();
    if (checkValidVat(vat).isValid && checkValidVat(vat)?.country?.name.toLowerCase() == country?.toLowerCase()) {
      setValidVat(true);
    } else {
      setValidVat(false);
    }
  }, []);

  const requestUpdateCompanyInfo = () => {
    populateVatPercent();
    props.requestUpdateCompanyInfo();
  };

  const populateVatPercent = () => {
    if (props.companyInfo) {
      const { vat, country } = props.companyInfo;
      let europe = isEurope(country);
      console.log('================>>>>.', europe, vat);
      let vatValue = 0;
      if (europe != -1 && vat) {
        let countryCode = vat.substring(0, 2);
        let checkVatResult = checkValidVat(vat);
        console.log('---------------', countryCode, country, checkVatResult);

        if (countryCode == 'SE') {
          vatValue = 25;
        } else {
          if (checkVatResult.isValid && checkVatResult.country?.name.toLowerCase() == country?.toLowerCase()) {
            vatValue = 0;
          } else {
            vatValue = 25;
          }
        }
      } else if (europe != -1 && !vat) {
        vatValue = 25;
      } else {
        vatValue = 0;
      }
      updateCompanyInfo('vatPercent', vatValue);
    }
  };
  const updateCompanyInfo = (key, value) => {
    props.updateCompanyInfo({ key, value: value });
  };

  // handle action change value
  const handleChangeName = (e) => {
    updateCompanyInfo('name', e.target.value);
  };
  const handleChangeSize = (e, { value }) => {
    updateCompanyInfo('size', props.sizeCompany ? props.sizeCompany[value] : null);
  };
  const handleChangeAddress = (e) => {
    updateCompanyInfo('address', e.target.value);
  };
  const handleChangePostalCode = (e) => {
    updateCompanyInfo('postalCode', e.target.value);
  };
  const handleChangeCity = (e) => {
    updateCompanyInfo('city', e.target.value);
  };
  const handleChangeState = (e) => {
    updateCompanyInfo('state', e.target.value);
  };
  const handleChanegCountry = (e, { value }) => {
    updateCompanyInfo('country', value);
    if (
      checkValidVat(vat).isValid &&
      checkValidVat(vat)?.country?.name.toLowerCase() == value?.toLowerCase()
    ) {
      setValidVat(true);
    } else {
      setValidVat(false);
    }
  };
  const handleChangeVat = (e) => {
    updateCompanyInfo('vat', e.target.value);
    if (
      checkValidVat(e.target.value).isValid &&
      checkValidVat(e.target.value)?.country?.name.toLowerCase() == country?.toLowerCase()
    ) {
      setValidVat(true);
    } else {
      setValidVat(false);
    }
  };
  const checkValidVat = (value) => {
    ('countries');
    return checkVAT(value, countries);
  };
  const handleClickAvatar = (e) => {
    document.getElementById('company-photo').click();
    document.getElementById('company-photo').onchange = function() {
      if (this.files && this.files.length) {
        props.imageOnCropEnabled(this.value, this.files[0]);
      }
    };
  };

  const avatarUrl = imageData
    ? imageData
    : avatar
    ? `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${avatar.slice(-3)}/${avatar}`
    : null;
  return (
    <div className={css.container}>
      <Image
        onClick={handleClickAvatar}
        src={avatarUrl ? avatarUrl : '/square-image.png'}
        width={80}
        height={80}
        circular
        style={{ marginBottom: '10px' }}
      />
      <input type="file" id="company-photo" style={{ display: 'none' }} />

      <Grid verticalAlign="middle">
        <GridRow style={{ padding: 4 }}>
          <GridColumn width={4}>
            <p className={css.label}>{_l`Company name`}</p>
          </GridColumn>
          <GridColumn width={12}>
            <Input fluid className={css.input} value={name} onChange={handleChangeName} />
          </GridColumn>
        </GridRow>
        <GridRow style={{ padding: 2 }}>
          <GridColumn width={4}>
            <p className={css.label}>{_l`Phone`}</p>
          </GridColumn>
          <GridColumn width={12}>
            <PhonePane phones={additionalPhoneList || []} formKey="companyInfo" />
          </GridColumn>
        </GridRow>
        <GridRow style={{ padding: 2 }}>
          <GridColumn width={4}>
            <p className={css.label}>{_l`Email`}</p>
          </GridColumn>
          <GridColumn width={12}>
            <EmailPane emails={additionalEmailList || []} formKey="companyInfo" />
          </GridColumn>
        </GridRow>
        <GridRow style={{ padding: 4 }}>
          <GridColumn width={4}>
            <p className={css.label}>{_l`Size`}</p>
          </GridColumn>
          <GridColumn width={12}>
            <SizeDropdown
              fluid
              value={size ? size.uuid : null}
              onChange={handleChangeSize}
              calculatingPositionMenuDropdown={calculatingPositionMenuDropdown}
            />
          </GridColumn>
        </GridRow>
        <GridRow style={{ padding: 4 }}>
          <GridColumn width={4}>
            <p className={css.label}>{_l`Address`}</p>
          </GridColumn>
          <GridColumn width={12}>
            <Input fluid className={css.input} onChange={handleChangeAddress} value={address} />
          </GridColumn>
        </GridRow>
        <GridRow style={{ padding: 4 }}>
          <GridColumn width={4}>
            <p className={css.label}>{_l`Postal code`}</p>
          </GridColumn>
          <GridColumn width={12}>
            <Input fluid className={css.input} onChange={handleChangePostalCode} value={postalCode} />
          </GridColumn>
        </GridRow>
        <GridRow style={{ padding: 4 }}>
          <GridColumn width={4}>
            <p className={css.label}>{_l`City`}</p>
          </GridColumn>
          <GridColumn width={12}>
            <Input fluid className={css.input} onChange={handleChangeCity} value={city} />
          </GridColumn>
        </GridRow>
        <GridRow style={{ padding: 4 }}>
          <GridColumn width={4}>
            <p className={css.label}>{_l`State`}</p>
          </GridColumn>
          <GridColumn width={12}>
            <Input fluid className={css.input} onChange={handleChangeState} value={state} />
          </GridColumn>
        </GridRow>
        <GridRow style={{ padding: 4 }}>
          <GridColumn width={4}>
            <p className={css.label}>{_l`Country`}</p>
          </GridColumn>
          <GridColumn width={12}>
            <CountryDropdown fluid onChange={handleChanegCountry} value={country} />
          </GridColumn>
        </GridRow>
        <GridRow style={{ padding: 4 }}>
          <GridColumn width={4}>
            <p className={css.label}>{_l`VAT number`}</p>
          </GridColumn>
          <GridColumn width={12}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Input
                type="text"
                fluid
                className={css.input}
                onChange={handleChangeVat}
                value={vat}
                style={{ width: '100%', marginRight: '5px' }}
              />
              {validVat ? (
                <div className={css.setDone}>
                  <div />
                </div>
              ) : (
                <div className={css.notSetasDone}>
                  <div />
                </div>
              )}
            </div>
          </GridColumn>
        </GridRow>
        <GridRow centered verticalAlign="middle">
          <Button className={css.btnDone} onClick={requestUpdateCompanyInfo}>{_l`Done`}</Button>
        </GridRow>
      </Grid>
      <CropPhotoModal type="COMPANY" />
    </div>
  );
};

const mapStateToProps = (state) => ({
  companyInfo: state.settings.companyInfo,
  sizeCompany: state.entities.size,
});

const mapDispatchToProps = {
  fetchCompanyInfoRequest: SettingActions.fetchCompanyInfoRequest,
  requestUpdateCompanyInfo: SettingActions.requestUpdateCompanyInfo,
  updateCompanyInfo: SettingActions.updateCompanyInfo,
  imageOnCropEnabled: SettingActions.imageOnCropEnabled,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyInfoPane);
