import React, { Component } from 'react'

export class PipelineSvg extends Component {

    render() {
        const { color = "#808080" } = this.props;
        return (
            <svg width="18px" height="18px" viewBox="0 0 12 20" version="1.1">
                <title>Pipeline</title>
                <desc>Created with Sketch.</desc>
                <g id="Design-System" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Icons" transform="translate(-66.000000, -181.000000)">
                        <g id="Pipeline" transform="translate(60.000000, 179.000000)">
                            <rect id="Rectangle-Copy" x="0" y="0" width="24" height="24"></rect>
                            <path d="M13,17.909 L13,13.092 C14.807,13.399 16,14.496 16,15.5 C16,16.504 14.807,17.601 13,17.909 M8,8.5 C8,7.496 9.193,6.399 11,6.092 L11,10.909 C9.193,10.601 8,9.504 8,8.5 M15.77,12 C14.986,11.521 14.038,11.195 13,11.065 L13,6.092 C14.807,6.399 16,7.496 16,8.5 C16,9.053 16.447,9.5 17,9.5 C17.553,9.5 18,9.053 18,8.5 C18,6.267 15.834,4.425 13,4.068 L13,3 C13,2.448 12.553,2 12,2 C11.447,2 11,2.448 11,3 L11,4.068 C8.166,4.425 6,6.267 6,8.5 C6,9.92 6.87,11.18 8.23,12 C9.014,12.48 9.962,12.806 11,12.936 L11,17.909 C9.193,17.601 8,16.504 8,15.5 C8,14.948 7.553,14.5 7,14.5 C6.447,14.5 6,14.948 6,15.5 C6,17.734 8.166,19.576 11,19.933 L11,21 C11,21.553 11.447,22 12,22 C12.553,22 13,21.553 13,21 L13,19.933 C15.834,19.576 18,17.734 18,15.5 C18,14.08 17.13,12.82 15.77,12" id="Fill-1" fill={color}></path>
                        </g>
                    </g>
                </g>
            </svg>
        )
    }
}
