import React from 'react';
import { compose, branch, renderComponent, withHandlers } from 'recompose';
import './photo-element.less';
import { Close } from './PhotoViewerElement';

export const getImageLink = (uuid)=>{
    const folder = uuid.substring(uuid.length - 3, uuid.length);
    return `https://d3si3omi71glok.cloudfront.net/salesboxfiles/${folder}/${uuid}`
}

const Documents = ({ photo, onClick, onClose })=>{
    const { photoDTOList } = photo;
    if (photoDTOList.length === 0){
        return <div/>
    }

    const uuid = photoDTOList[0].uuid;
    const imageUrl = getImageLink(uuid);
    return <div onClick={onClick} className="photo-documents">
        <div onClick={e => {
            e.stopPropagation();
            onClose();
        }} className="close-icon">
            <Close size={14}/>
        </div>
        <img className="photo" src={imageUrl}/>
        <div className="photo-pane-bottom"/>
    </div>
}

const PhotoItemList = ({ photo, onClick })=> {
    const uuid = photo.uuid;
    const imageUrl = getImageLink(uuid);
    return <img onClick={onClick} className="photo-item-list" src={imageUrl} />
}

const PhotoItemStack = ({ photo, onClick, stack, onClose }) => {
    const uuid = photo.uuid;
    const imageUrl = getImageLink(uuid);
    return <div className={stack ? "stack-wapper-item" : "stack-wapper-list"}>
        <div onClick={e => {
            e.stopPropagation();
            onClose();
        }} className="close-icon">
            <Close size={14} />
        </div>
        <img onClick={onClick} className={stack ? "photo-item-stack" : "photo-item-list"} src={imageUrl} />
    </div>
}

export default compose(
    branch(({ documents }) => documents, renderComponent(Documents)),
    branch(({ photoList }) => photoList, renderComponent(PhotoItemList)),
    branch(({ photoStack }) => photoStack, renderComponent(PhotoItemStack)),
    //photoStack
)(PhotoItemList);