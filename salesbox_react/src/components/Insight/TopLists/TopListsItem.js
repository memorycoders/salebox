import React from 'react';
import Avatar from '../../Avatar/Avatar'
import accountAvatar from '../../../../public/Accounts.svg'
import css from './TopLists.css'
import { OverviewTypes } from '../../../Constants'

export const TopListsItem = ({ avatar, name, right })=> {
    return <div className={css.topListsItem}>
        <div className={css.left}>
            <Avatar overviewType={OverviewTypes.Account} fallbackIcon={accountAvatar} size={30} src={avatar} />
            {name}
       </div>
       {right}
    </div>
}