//@flow
import * as React from 'react';
import { compose, withProps, defaultProps, lifecycle, withState } from 'recompose';
import { Icon } from 'semantic-ui-react';
import cx from 'classnames';
import css from './Avatar.css';
import starActiveSvg from '../../../public/myStar_active.png';
import accountAdd from '../../../public/Accounts.svg';
import { OverviewTypes } from 'Constants';
type PropsType = {
  style: {},
  border: string,
  src: string,
  fallbackIcon: string,
  backgroundColor: string,
  missingColor: string,
};

const Avatar = ({
  size,
  backgroundColor,
  border,
  src,
  fallbackIcon,
  missingColor,
  onClick,
  firstName,
  lastName,
  fullName,
  isShowName,
  borderSize,
  containerStyle,
  overviewType,
  isNoAvatar,
  isFlip }: PropsType) => {
  let style = {
    width: size,
    height: size,
    backgroundColor,
/*
    backgroundImage: src ? `url(https://d3si3omi71glok.cloudfront.net/salesboxfiles/${src.slice(-3)}/${src})` : `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVAAAACWCAMAAAC/8CD2AAAAA1BMVEXNzc2ljC/HAAAAR0lEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF8GxXYAARizDlgAAAAASUVORK5CYII=`,
*/
    backgroundImage: src ? (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')  ? `url(${src})`: `url(https://d3si3omi71glok.cloudfront.net/salesboxfiles/${src.slice(-3)}/${src})`) : `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVAAAACWCAMAAAC/8CD2AAAAA1BMVEXNzc2ljC/HAAAAR0lEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF8GxXYAARizDlgAAAAASUVORK5CYII=`,
  }
  if(src && (src.startsWith('http://') ||src.startsWith('https://') || src.startsWith('/') )){
    style.backgroundSize='50%';
  }

  if (isShowName){
    const firstNameChar = firstName != null && firstName.length > 0 ? firstName.charAt(0) : '';
    const lastNameChar = lastName != null && lastName.length > 0 ? lastName.charAt(0) : '';
    const character1 = fullName !=null && fullName.length > 0 ? fullName.charAt(0) : '';
    const character2 = fullName !=null && fullName.length > 0 ? fullName.substr(fullName.indexOf(' ')+1).charAt(0) : '';
    return (
      <div style={{ borderWidth: borderSize ? borderSize : 6, ...containerStyle}} onClick={onClick} className={cx(css.wrapper, css[border])}>
        {src ? <div className={css.avatar} style={style}>
        </div> :
          <div style={{
            width: size,
            height: size,
            backgroundColor,
          }} className={css.avatar}>
              <span style={{ color: '#fff' }}>{fullName ? character1 + character2 : firstNameChar + lastNameChar}</span>

          </div>
          }
      </div>
    );
  }
  const firstNameChar = firstName != null && firstName.length > 0 ? firstName.charAt(0) : '';
  const lastNameChar = lastName != null && lastName.length > 0 ? lastName.charAt(0) : '';
  return (
    <div style={{ borderWidth: borderSize ? borderSize : 6, ...containerStyle }} onClick={onClick} className={cx(css.wrapper, css[border])}>
      {src ? <div className={css.avatar} style={style}>
      </div> :
        <div style={{
          width: size,
          height: size,
          backgroundColor,
        }} className={css.avatar}>
          {(!src && !isFlip) && (
            overviewType === OverviewTypes.Account ?
            <img src={accountAdd} color={missingColor} style={{ height: size/2, width: size/2 }} />
              : <img inverted src={fallbackIcon} color={missingColor} style={{ height: isNoAvatar ? size / 2 : '40px', width: isNoAvatar ? size / 2 : '40px' }} />
          )}
        </div>
        }
    </div>
  );
};

export default compose(
  defaultProps({
    size: 40,
    backgroundColor: 'rgba(200, 200, 200)',
    // fallbackIcon: starActiveSvg
  })
)(Avatar);
