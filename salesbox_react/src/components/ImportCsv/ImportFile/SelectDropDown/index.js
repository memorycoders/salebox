/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect, useRef } from 'react';
import { Label, Icon } from 'semantic-ui-react';
import cx from 'classnames';
import _l from 'lib/i18n';
import FuzzySearch from 'fuzzy-search';
import './style.less';
import css from '../ColumnMap/style.css';

const classCommonModalContent = 'common-list-content';
let _lastDropdownId = null;
export const calculatingPositionMenuDropdown = (id, classDialog, isGetOffsetByParrent) => {
  if (id) {
    _lastDropdownId = id;
  } else {
    id = _lastDropdownId;
  }
  let dropdown = document.getElementById(id);
  if (dropdown) {
    const _widthDropdown = dropdown.offsetWidth;
    let _menu = dropdown.getElementsByClassName(`${classDialog ? classDialog : 'dropdown-menu'}`)[0];
    let _commonContent = document.getElementsByClassName(classCommonModalContent);
    console.log('_commonContent', _commonContent[_commonContent.length - 1].offsetTop);
    console.log('menu', _menu);
    if (_menu) {
      _menu.style.width = _widthDropdown;
      _menu.style.minWidth = _widthDropdown;
      const _offsetTop = isGetOffsetByParrent
        ? dropdown.offsetTop + dropdown.offsetParent.offsetTop
        : dropdown.offsetTop;
      const scrollTop =
        _commonContent && _commonContent[_commonContent.length - 1]
          ? _commonContent[_commonContent.length - 1].scrollTop
          : 0;
      const fixTop =
        _commonContent && _commonContent[_commonContent.length - 1]
          ? _commonContent[_commonContent.length - 1].offsetTop
          : 0;
      if (scrollTop > 0) {
        _menu.style.top = _offsetTop - scrollTop + 27 > fixTop ? _offsetTop - scrollTop + 27 : fixTop;
      } else {
        _menu.style.top = _offsetTop + 27 > fixTop ? _offsetTop + 27 : fixTop;
      }
      // _menu.style.top =
      // _offsetTop +
      //   27 -
      //   (_commonContent && _commonContent[_commonContent.length - 1]
      //     ? _commonContent[_commonContent.length - 1].scrollTop
      //     : 0);
      _menu.style.left = isGetOffsetByParrent
        ? dropdown.offsetLeft + dropdown.offsetParent.offsetLeft + 2
        : dropdown.offsetLeft + 1;
      _menu = null;
      _commonContent = null;
    }
  }
  dropdown = null;
};

const SelectDropDown = (props) => {
  const [open, setOpen] = useState(false);
  const el = useRef(null);

  const [accountLabels, setAccountLabels] = useState(props.accountLabels || []);
  const [contactLabels, setContactLabels] = useState(props.contactLabels || []);
  const [accountLabelsFullData, setaccountLabelsFullData] = useState(props.accountLabels || []);
  const [contactLabelsFullData, setcontactLabelsFullData] = useState(props.contactLabels || []);

  useEffect(() => {
    document.addEventListener('click', _onDocumentClick);
    return () => {
      document.removeEventListener('click', _onDocumentClick);
    };
  }, [open]);

  const _onDocumentClick = (event) => {
    if (open && !el.current.contains(event.target)) {
      setOpen(false);
    }
  };

  const onSearch = (event) => {
    const accountSearch = new FuzzySearch(accountLabelsFullData, ['viewLabel'], {
      caseSensitive: false,
    });
    const result = accountSearch.search(event.target.value);
    setAccountLabels(result);
    const contactSearch = new FuzzySearch(contactLabelsFullData, ['viewLabel'], {
      caseSensitive: false,
    });
    const result1 = contactSearch.search(event.target.value);
    setContactLabels(result1);
  };

  useEffect(() => {
    setAccountLabels(props.accountLabels);
    setaccountLabelsFullData(props.accountLabels);
  }, [props.accountLabels, props.contactLabels]);

  useEffect(() => {
    setContactLabels(props.contactLabels);
    setcontactLabelsFullData(props.contactLabels);
  }, [props.contactLabels, props.accountLabels]);

  const wrapperClasses = ['sl-select dropdown', 'form-group'];
  if (open) wrapperClasses.push('open');
  const { colDropDowns, setRequiredCol, columnIndex } = props;
  return (
    <div className={wrapperClasses.join(' ')} ref={el}>
      {/* <div className="field-body">

      </div> */}
      <div className="select-display-wrapper position-clear" id={props.colId}>
        <div
          className="select-display ui loading icon input"
          onClick={() => {
            setOpen(true);
            calculatingPositionMenuDropdown(props.colId);
          }}
        >
          {(!colDropDowns || (colDropDowns && !colDropDowns.sValue)) && (
            <input onClick={() => setOpen(true)} placeholder={_l`Ignore column`} type="text" onChange={onSearch} />
          )}
          {colDropDowns && colDropDowns.sValue && (
            <Label
              as="a"
              className={cx(
                css.btn,
                css.btnLabel,
                { [css.btnAccount]: colDropDowns.sGroup === 'account' },
                { [css.btnContact]: colDropDowns.sGroup === 'contact' }
              )}
            >
              {
                colDropDowns.sValue?.includes('(Custom Field)') ?colDropDowns.sValue : _l.call(this, [colDropDowns.sValue])
              }

              <Icon
                name="delete"
                onClick={() => {
                  setRequiredCol(columnIndex, colDropDowns, 'del');
                  setOpen(false);
                }}
                style={{ color: '#fff' }}
              />
            </Label>
          )}
        </div>
        <div className="dropdown-menu">
          <ul>
            <li>
              <strong>{_l`Company`}</strong>
            </li>
            {accountLabels.map((c, index) => {
              if (c.vis) {
                return (
                  <li key={index}>
                    <a
                      onClick={() => {
                        setRequiredCol(columnIndex, c, 'add');
                        setOpen(false);
                      }}
                    >
                      {c.viewLabel}
                    </a>
                  </li>
                );
              }
            })}
            <li>
              <strong>{_l`Contact`}</strong>
            </li>
            {contactLabels.map((c, index) => {
              if (c.vis) {
                return (
                  <li key={index}>
                    <a
                      onClick={() => {
                        setRequiredCol(columnIndex, c, 'add');
                        setOpen(false);
                      }}
                    >
                      {c.viewLabel}
                    </a>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default SelectDropDown;
