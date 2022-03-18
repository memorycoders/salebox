import React, { useState, useEffect } from 'react';
import { compose, branch, renderComponent, withHandlers } from 'recompose';
import { Icon, Progress } from 'semantic-ui-react';
import Carousel, { } from 'react-images';


export class Header extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isRecord: false
        }
    }

    componentWillMount(){

        this.setState({ isRecord: this.props.isRecord })
    }

    setRecord = isRecord => {
        this.setState({ isRecord }, ()=>{
            this.props.onRecord(isRecord);
        })
    }

    render(){

        const {
            currentIndex,
            interactionIsIdle,
            isFullscreen,
            views,
            modalProps,
            onZoom,
            onChangeCurrentIndex } = this.props;
        const { isRecord } = this.state;
        const { onClose, toggleFullscreen } = modalProps;
        const FsIcon = isFullscreen ? FullscreenExit : FullscreenEnter;
        return <div style={{ opacity: interactionIsIdle && !isRecord ? 0 : 1, }} className="photo-viewer-header">
            {isRecord && <ProgressTimer
                currentIndex={currentIndex}
                imageLength={views.length}
                onProgress={onChangeCurrentIndex} />}
            <span>{currentIndex + 1}/{views.length}</span>
            <div className="photo-header-controlls">
                <div className="button-icon">
                    <Icon onClick={() => onZoom(false)} className="zoom-icon" name="zoom-out" />
                </div>
                <div className="button-icon">
                    <Icon onClick={() => onZoom(true)} className="zoom-icon" name="zoom-in" />
                </div>
                <div className="button-icon">
                    <FsIcon onClick={() => toggleFullscreen()} size={22} />
                </div>
                {views.length > 1 && (<div className="button-icon">
                    <Icon onClick={() => this.setRecord(!isRecord)} className="zoom-icon" name={!isRecord ? "play circle outline" : "pause circle outline"} /></div>)}
                <a target="_blank" download href={views[currentIndex].source} className="button-icon">
                    <Icon name="download" className="zoom-icon" size={22} />
                </a>
                <div className="button-icon">
                    <Close onClick={(e) => onClose(e)} size={22} />
                </div>
            </div>
        </div>
    }
}

export const Close = ({ size = 32, ...props }) => (
    <Svg size={size} {...props}>
        <path d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z" />
    </Svg>
);
export const FullscreenEnter = ({ size = 32, ...props }) => (
    <Svg size={size} {...props}>
        <path d="M14.016 5.016h4.969v4.969h-1.969v-3h-3v-1.969zM17.016 17.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 9.984v-4.969h4.969v1.969h-3v3h-1.969zM6.984 14.016v3h3v1.969h-4.969v-4.969h1.969z" />
    </Svg>
);
export const FullscreenExit = ({ size = 32, ...props }) => (
    <Svg size={size} {...props}>
        <path d="M15.984 8.016h3v1.969h-4.969v-4.969h1.969v3zM14.016 18.984v-4.969h4.969v1.969h-3v3h-1.969zM8.016 8.016v-3h1.969v4.969h-4.969v-1.969h3zM5.016 15.984v-1.969h4.969v4.969h-1.969v-3h-3z" />
    </Svg>
);

export const ZoomIn = ({ size = 32, ...props }) => (
    <Svg size={size} {...props}>

    </Svg>
);

const Svg = ({ size, ...props }) => (
    <svg
        role="presentation"
        viewBox="0 0 24 24"
        style={{ width: size, height: size }}
        css={{
            display: 'inline-block',
            fill: 'currentColor',
            height: size,
            stroke: 'currentColor',
            strokeWidth: 0,
            width: size,
        }}
        {...props}
    />
);

class ProgressTimer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            percent: 0
        }
        this.intervel = null;
    }

    componentDidMount() {
        const { onProgress, imageLength } = this.props;
        this.intervel = setInterval(() => {

            if (this.state.percent === 5) {
                this.setState({ percent: 0 })
            } else {
                this.setState({ percent: this.state.percent + 1 }, () => {
                    if (this.state.percent === 5) {
                        if (this.props.currentIndex + 1 < imageLength) {
                            onProgress && onProgress(this.props.currentIndex + 1);
                        } else {
                            onProgress && onProgress(0);
                        }

                    }
                })
            }

        }, 1000)
    }

    componentWillUnmount() {
        this.intervel && clearInterval(this.intervel)
    }

    render() {
        const { percent } = this.state;
        return <Progress className="progress-record" percent={percent * 20} size='tiny'></Progress>
    }
}
