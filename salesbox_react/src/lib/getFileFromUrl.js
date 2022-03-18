export const getFileFromURL = (url, element)=> {
    element.append("<iframe src='" + url + "' style='display: none;' ></iframe>");
}