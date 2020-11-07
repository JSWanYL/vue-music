var _guid = "";
export function _getGuid() {
    if (_guid.length > 0)
        return _guid;
    //var e = MUSIC.cookie.get("pgv_pvid");
    // if (e && e.length > 0)
    //     return _guid = e;
    var t = (new Date).getUTCMilliseconds();
    return _guid = Math.round(2147483647 * Math.random()) * t % 1e10,
    document.cookie = "pgv_pvid=" + _guid + "; Expires=Sun, 18 Jan 2038 00:00:00 GMT; PATH=/; DOMAIN=qq.com;",
    _guid
}