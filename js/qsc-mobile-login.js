$.include(['BigInt.js','Barrett.js','RSA.js']);

$('#login_submit').click(function(){
    stuid = $("#stuid").val();
    
    var rsa_n = "AA18ABA43B50DEEF38598FAF87D2AB634E4571C130A9BCA7B878267414FAAB8B471BD8965F5C9FC3818485EAF529C26246F3055064A8DE19C8C338BE5496CBAEB059DC0B358143B44A35449EB264113121A455BD7FDE3FAC919E94B56FB9BB4F651CDB23EAD439D6CD523EB08191E75B35FD13A7419B3090F24787BD4F4E1967";
    setMaxDigits(131); //131 => n的十六进制位数/2+3  
    var key      = new RSAKeyPair("10001", '', rsa_n); //10001 => e的十六进制  
    pwd = $("#pwd").val();
    pwd = encryptedString(key, pwd); //不支持汉字

    myGetJsonp('validate', function(data) {
        if(stuid != '') {
            localStorage.setItem('stuid', stuid);
            localStorage.setItem('pwd', pwd);
            localStorage.setItem('isLogin', true);
            isLogin = true;
            $('#login').slideUp(200);
        } else {
            localStorage.setItem('isLogin', false);
            isLogin = false;
        }
    });
});
