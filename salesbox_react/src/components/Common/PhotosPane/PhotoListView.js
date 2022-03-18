import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import PhotoItem from './PhotoElement';
import { Icon } from 'semantic-ui-react';
import { PhotosView } from './PhotosView';
import { highlight } from '../../Overview/overview.actions';
import { refreshQualifiedDetail } from '../../PipeLineQualifiedDeals/qualifiedDeal.actions';
import api from '../../../lib/apiClient';
class PhotosListViewC extends Component {

  constructor(props) {
    super(props);
    this.state = {
      choisePhoto: null,
      stack: false,
      isViewer: false
    }
  }

  onClickFolder = (photo) => {
    this.setState({ choisePhoto: photo })
  }

  onChangePhotoShow = (isStack) => {
    this.setState({ stack: isStack })
  }

  onChangeViewerShow = (isViewer) => {
    this.setState({ isViewer })
  }

  componentWillReceiveProps(nextProps){
    const { photos } = this.props;
    const { choisePhoto } = this.state;
    if (nextProps.photos !== photos && nextProps.photos){
      if (choisePhoto){
        const findPhoto = nextProps.photos.find(value => value.uuid === choisePhoto.uuid);
        if (findPhoto){
          this.setState({ choisePhoto: findPhoto })
        }
      }
    }
  }

  onDeleteDocument = (photo)=> {
    const { highlight, overviewType } = this.props;
    highlight(overviewType, photo.uuid, 'delete_photo')
  }

  onDeletePhoto = async (photo)=> {
    const { refreshQualifiedDetail } = this.props;
    try {
      const result = await api.get({
        resource: `document-v3.0/photo/delete/photo/${photo.uuid}`,
      });
      refreshQualifiedDetail('photo')
    } catch (error) {
      console.log(error)
    }
  }

  renderPhoto() {
    const { photos, highlight, overviewType } = this.props;
    const { choisePhoto, stack, isViewer } = this.state;
    if(isViewer){
      return <PhotosView onChangeViewerShow={() => this.onChangeViewerShow(false)} folder={choisePhoto}/>
    }
    if (choisePhoto) {
      const { photoDTOList } = choisePhoto;
      return <div className="photos-column" >
        <div className="photo-info">
          {choisePhoto.description}
          <div className="circle-icon circle-icon-small" onClick={()=> {
            highlight(overviewType, choisePhoto.uuid, 'photo_edit', choisePhoto)
          }}>
            <img className="edit-photo-icon" src={require('../../../../public/Edit.svg')} />
          </div>
        </div>
        <div className="photo-controls">
          <div className="photo-date">
            {moment(choisePhoto.updatedDate).format('DD MMM, YYYY')}
          </div>
          <div className="photo-change-list">
            <div className={`circle-icon ${!stack ? 'circle-icon-active' : ''}`}>
              <Icon className="icon-button" onClick={() => this.onChangePhotoShow(false)} style={{ color: '#9d9d9c' }} size={20} name="list" />
            </div>
            <div className={`circle-icon ${stack ? 'circle-icon-active' : ''}`}>
              <Icon className="icon-button" onClick={() => this.onChangePhotoShow(true)} style={{ color: '#9d9d9c' }} size={20} name="grid layout" />
            </div>

          </div>
        </div>
          <div className="photos-row" >
            {photoDTOList.map(photo => {
              return <PhotoItem onClose={() => this.onDeletePhoto(photo)} onClick={() => this.onChangeViewerShow(true)} stack={stack} photoStack photo={photo} />
            })}
          </div >
      </div >

    }
    return (
      <div className="photos-row">
        {photos.map(photo => {
          return <PhotoItem onClose={() => this.onDeleteDocument(photo)}  onClick={() => this.onClickFolder(photo)} documents photo={photo} />
        })}
      </div>
    )
  }

  render(){
    const { photos } = this.props;
    let countImage = 0;
    photos.forEach(value => {
      countImage += value.photoDTOList.length;
    })

    return <>
      <div onClick={()=> this.setState({ choisePhoto: null })} className="photo-header">
        <span>All ({countImage})</span>
      </div>
      {this.renderPhoto()}
    </>
  }
}

export const PhotosListView = connect(null, {
  highlight,
  refreshQualifiedDetail
})(PhotosListViewC);
