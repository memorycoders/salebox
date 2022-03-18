import React from 'react';
import { Input, Icon } from 'semantic-ui-react';

import { IconButton } from '../../Common/IconButton';
import addImg from '../../../../public/Add.svg';
import css from './index.css';

const TableHeader = ({ width, title, inputPlaceholder, onInputChange, children, onClickAdd, searchValue }: any) => {
  const _onInputChange = (e) => {
    const { value } = e.target;
    onInputChange(value);
  };

  const _onClearSearch = () => {
    onInputChange('');
  };

  return (
    <div className={css.headerContainer}>
      <div className={css.categoryContainer}>
        <div>
          <span className={css.categoryTitle}>{title}</span>
          {children}
        </div>

        <div className={css.freeSearchContainer}>
          <div className={css.freeSearch}>
            <div className={css.typesSearch}>
              <div className={css.iconSearch}></div>
            </div>
            <Input
              className={css.inputSearch}
              fluid
              focus
              size="medium"
              value={searchValue}
              onChange={_onInputChange}
              icon={
                <Icon
                  size={10}
                  className={css.searchIcon}
                  // onClick={() => this.setSearchTerm(this.state.freeTextSearch)}
                  name="search"
                  link
                />
              }
              placeholder={inputPlaceholder}
            />
          </div>
        </div>

        <IconButton
          onClick={onClickAdd}
          className={css.viewIconAddHeader}
          imageClass={css.imageClass}
          size={24}
          src={addImg}
        />
      </div>
    </div>
  );
};

export default TableHeader;
