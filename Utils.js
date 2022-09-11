function getRemainRequest(remainingReq) {
    const list = remainingReq.replaceAll(' ','').split(';');
    const group = list[0].split('=')[1];
    const min = list[1].split('=')[1];
    const sec = list[2].split('=')[1];
    
    return {group, min, sec}
}

module.exports = {
    getRemainRequest
}