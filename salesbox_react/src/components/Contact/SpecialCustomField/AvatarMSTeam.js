import React, { useState, useEffect } from 'react';
import { Image } from 'semantic-ui-react';
import axios from 'axios';
import Avatar from '../../Avatar/Avatar';

function AvatarMSTeam({ message, accessToken }) {
  const [avatarUrl, setavatarUrl] = useState(null);

  const src = message && message.from && message.from.user.avatar;

  useEffect(() => {
    axios
      .get(src, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: 'arraybuffer',
      })
      .then((res) => {
        const base64 = Buffer.from(res.data, 'binary').toString('base64');
        const base = 'data:image/jpeg;base64, ' + base64;
        setavatarUrl(base);
      })
      .catch((e) => {
        setavatarUrl(null);
      });
  }, []);

  return (
    <>
      {avatarUrl ? (
        <Image size="mini" style={{ margin: '0 auto' }} src={avatarUrl} circular />
      ) : (
        <Avatar size={32} isShowName fullName={message && message.from.user.displayName} />
      )}
    </>
  );
}

export default AvatarMSTeam;
