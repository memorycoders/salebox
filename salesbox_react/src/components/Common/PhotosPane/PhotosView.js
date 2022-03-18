import React, { Component } from 'react';
import Carousel, { ModalGateway, Modal } from 'react-images';
import { getImageLink } from './PhotoElement';
import { Header } from './PhotoViewerElement';

const navButtonStyles = base => ({
  ...base,
  backgroundColor: 'white',
  boxShadow: '0 1px 6px rgba(0, 0, 0, 0.18)',
  color: 'rgba(0, 0, 0, 0.14)',

  '&:hover, &:active': {
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.14)',
    opacity: 1,
  },
  '&:active': {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.14)',
    transform: 'scale(0.96)',
  },
});

export class PhotosView extends Component {
  state = { zoom: 1, currentIndex: 0, isRecord: false }

  getImages = () => {
    const { folder } = this.props;
    const { photoDTOList } = folder;
    return photoDTOList.map(value => {
      return { source: getImageLink(value.uuid) }
    })
  }

  onZoom = (zoomIn) => {
    const { zoom } = this.state;
    if (zoomIn) {
      this.setState({ zoom: zoom + 0.5 })
    } else {
      if (zoom > 1) {
        this.setState({ zoom: zoom - 0.5 })
      }
    }
  }

  onRecord = (isRecord) => {

    this.setState({ isRecord })
  }

  onChangeCurrentIndex = (currentIndex)=> {
    this.setState({ currentIndex })
  }

  render() {
    const { onChangeViewerShow } = this.props;
    const { zoom, currentIndex, isRecord } = this.state;
    return (
      <ModalGateway>
        <Modal closeOnBackdropClick={false} allowFullscreen={false} onClose={onChangeViewerShow}>
          <Carousel
            trackProps={{
              flickTimeout: 3000
            }}
            interactionIsIdle={false}
            hideControlsWhenIdle={false}
            currentIndex={currentIndex}
            components={{
              Header: props => <Header
                onZoom={this.onZoom}
                isRecord={isRecord}
                onRecord={this.onRecord}
                onChangeCurrentIndex={this.onChangeCurrentIndex}
                {...props} />,
              Footer: null
            }}

            styles={{
              container: base => ({
                ...base,
                height: '100vh',

              }),
              view: (base, state) => {
                return ({
                  ...base,
                  alignItems: 'center',
                  display: 'flex ',
                  height: 'auto !important',
                  width: 'auto !important',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  justifyContent: 'center',
                  transform: 'translate3d(0px, 0px, 0px)',
                  '& > img': {
                    maxHeight: zoom > 1 ? '100vh' : '100vh',
                    maxWidth: '100%',
                    objectFit: 'cover',
                    width: 'auto!important',
                    height: 'auto!important',
                    display: 'inline-block',
                    transition: 'transform .3s ease 0s, opacity .15s!important',
                    transform: `scale3d(${zoom}, ${zoom}, 1)`,
                  },
                })
              },
              navigationPrev: navButtonStyles,
              navigationNext: navButtonStyles,
              // header: base => ({
              //   ...base,
              //   background: 'rgba(0,0,0,.45) !important',
              //   height: '50px !important',
              //   alignItems: 'center',
              //   display: 'flex ',
              // })
            }}
            views={this.getImages()} />
        </Modal>
      </ModalGateway>

    )
  }
}
