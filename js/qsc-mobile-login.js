var stuid = '';
var pwd = '';
var rsa_n = "AA18ABA43B50DEEF38598FAF87D2AB634E4571C130A9BCA7B878267414FAAB8B471BD8965F5C9FC3818485EAF529C26246F3055064A8DE19C8C338BE5496CBAEB059DC0B358143B44A35449EB264113121A455BD7FDE3FAC919E94B56FB9BB4F651CDB23EAD439D6CD523EB08191E75B35FD13A7419B3090F24787BD4F4E1967";
var siteUrl = 'http://m.myqsc.com/dev3/mobile2/index.php';
var token = '';

$(document).ready(function() {
    $('#login_submit').bind("click", function(){
        stuid = $("#stuid").val();
        pwd = $("#pwd").val();

        setMaxDigits(131); //131 => n的十六进制位数/2+3
        var key      = new RSAKeyPair("10001", '', rsa_n); //10001 => e的十六进制
        pwd = encryptedString(key, pwd); //不支持汉字

        myGetJsonp('validate', true, function(data) {
            if(data['stuid'] != '') {
                token = data['token'];

                localStorage.setItem('stuid', stuid);
                localStorage.setItem('pwd', pwd);
                localStorage.setItem('token', token);
                localStorage.setItem('isLogin', true);

                // 跳转回到登录前的page
                window.history.go(-1);
            }
        });
    });
});