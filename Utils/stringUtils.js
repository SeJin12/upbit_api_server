
/**
 * 업비트 API 잔여 요청 수를 확인한다.
 * @param {*} remainingReq 
 * @returns 
 */
export function getRemainRequest(remainingReq) {
    const list = remainingReq.replaceAll(' ','').split(';');
    const group = list[0].split('=')[1]; // Group ID
    const min = list[1].split('=')[1]; // 남은 1분간 요청 수
    const sec = list[2].split('=')[1]; // 해당 초 남은 요청 수
    
    return {group, min, sec}
}