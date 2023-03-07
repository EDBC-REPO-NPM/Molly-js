const cert = `-----BEGIN CERTIFICATE-----
MIIEATCCAumgAwIBAgIJANupviS7XIX+MA0GCSqGSIb3DQEBCwUAMIGWMRMwEQYD
VQQDDAphcmVwYXR2LnRrMRIwEAYDVQQHDAlWZW5lenVlbGExDTALBgNVBAgMBExh
cmExEDAOBgNVBAoMB0FyZXBhVFYxFDASBgNVBAsMC1NTTCBTdXBwb3J0MScwJQYJ
KoZIhvcNAQkBFhhhcmVwYXR2T2ZpY2lhbEBnbWFpbC5jb20xCzAJBgNVBAYTAlZF
MB4XDTIyMDkwMTE1MTE1N1oXDTIzMDkwMTE1MTE1N1owgZYxEzARBgNVBAMMCmFy
ZXBhdHYudGsxEjAQBgNVBAcMCVZlbmV6dWVsYTENMAsGA1UECAwETGFyYTEQMA4G
A1UECgwHQXJlcGFUVjEUMBIGA1UECwwLU1NMIFN1cHBvcnQxJzAlBgkqhkiG9w0B
CQEWGGFyZXBhdHZPZmljaWFsQGdtYWlsLmNvbTELMAkGA1UEBhMCVkUwggEiMA0G
CSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDD2LYnHVkmcPyhao9pCYdlS854vYqZ
ki53TvP+rk44qcQ49pHLu8B4q+VPtxBNtZTO85ZayqV9eRownAIYFVHP+XeaGkvA
0F7gMr+w/+eGXG1aPbM6Uk/8sM0Pd8SZUjOV8MBiLKa0TGa/6pKev9OczENRAkCV
qYThVhUMnuYjxV8WaSM+nWeRXLgxEYcPRB0C6lRviR4tpZB4a7jlnhq7UBL5FmRj
zBBsgsNz0sUgdjXq5/SS2SqVzReD5T29RpctB2MyfxqsYA3XKGLCGzUM7vQJ37et
o/MXR6QGjHGLIsAvo0XW9DFneWMFfnNf9myo8rD/x3Rvi/YLJY5i/porAgMBAAGj
UDBOMAkGA1UdEwQCMAAwCwYDVR0PBAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMB
BggrBgEFBQcDAjAVBgNVHREEDjAMggphcmVwYXR2LnRrMA0GCSqGSIb3DQEBCwUA
A4IBAQChARMhoVGKLWNGtN3Tbm2okrIyrJJhXJxScdBgFEfEf4/H5nI82AxPNzpY
k+QUKmmnkxiVKZhNwpmvT8UvNehEFezYbdQOjW9FrUwSYl/e8dB9VxkKEhAxOguv
CdNIu3elDKWlU6iuJj2IKT4VyV39HyYTkMhjqbotU+i2GMK1eYhffc9NW4gWW39o
vpasEL3/+UnNVt/hDkGtfk1EJ+wkM/n2G0soMdmT469pc+oL6ano089+o9IPuKfV
BKtdQleYn5o83FwVQbqbU2PfDtzLTwhUQnNz7w4gmprs+opkUsB3OtOcSzuMRv66
KQA6hKYoacs8QOHoGaCL7c+2k4h+
-----END CERTIFICATE-----|-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAw9i2Jx1ZJnD8oWqPaQmHZUvOeL2KmZIud07z/q5OOKnEOPaR
y7vAeKvlT7cQTbWUzvOWWsqlfXkaMJwCGBVRz/l3mhpLwNBe4DK/sP/nhlxtWj2z
OlJP/LDND3fEmVIzlfDAYiymtExmv+qSnr/TnMxDUQJAlamE4VYVDJ7mI8VfFmkj
Pp1nkVy4MRGHD0QdAupUb4keLaWQeGu45Z4au1AS+RZkY8wQbILDc9LFIHY16uf0
ktkqlc0Xg+U9vUaXLQdjMn8arGAN1yhiwhs1DO70Cd+3raPzF0ekBoxxiyLAL6NF
1vQxZ3ljBX5zX/ZsqPKw/8d0b4v2CyWOYv6aKwIDAQABAoIBAGtmmN3ydkViiOhs
a6EKnLmsTNph93QoelrrbVspc7QXRYiHj4TOvcpvWh3RIpu7DJRBeR7pKsAYfYhS
xcM3Tdpj0HcuHITswFrq+byzWeCRJ1bppzRAl6TXwFzPLX13WtrLYHV2TyVpEKAG
n8l3ITFHw1LVjV2FzV1Vu81kBoluaao5kuqm0EZIrCUCKhBMkEv729qixyJgdtgF
8mvtMuCaoMc/JgThYNqtXQR20VLrcg32k63pXcwKuRUpUbCA7G/qDCdY+Yj0iepa
94c3WNY2ROla/uo6XyYyevVMbooq3gsCe3xKd0RWERhGxpUH1vSRSHqmt3Z55iFb
Q2rlBoECgYEA7VKwcCrrC3NpVPvPfB/uYGL4R1YdzGTpuX1mQd3gpjRcYDgW51/D
yHN4OCzmkNmrpzZjnuU3aTYhQKBs4DKm5wE1SYVhgx0uvKNb71vC9VKejJl+I4lk
JhuTVn+8aX9+nOfUe1iOeA+orKk8yhF9TpnBaUfQv3mgd9ASG8C/h/sCgYEA00Jm
62dkyLEiICBFfzFjlGPpcqBzxNrUOFzMzjsOhfONbk2MmZCAees08TVJjz0nzfnG
vNgTz4YwSlaz80DszyLMr7RuE1CGLJkcEoL8tDheZlvlaK7EkDS0fnox7kx6kQvp
+6arye8RxxjRJ6Qhj9MhO1M40lPKhgr4vs5Kr5ECgYAiRlP3Dyu9DqECxg9UNORf
hUuoOda540UiJeszzhCY0G0a9F7ScbE77PlK26k8+ELjNmay1xXmmwu4YrL2ujoC
mNkSUjIgFoHeepVXf2ArwA/n7G8cQMZ2/nqL/oy+i8xEavL0EXkZ++D3dsWxxU7c
oDYft2B9ltpHE4TZ/z9qKwKBgBjDVdEOI5AqwzdE0SChp2yDcZ/QEwHmLK4WoqMh
5Qfqjo95Y5u0hnrECUak2mSB5KKOPq9wHJJcxlhQZXOEDr4Q9DE8UxLMg43CvLmm
xPxTBy20Y+WrZrsIkoeoxyWJrWxHGzw2Qzi+XzUZQZsF8DEtrF2J2cU9sSWZL6Me
Bz8hAoGAborx5CTvbnEjtBFKUAzpGc3tSd3ifBOHRVmhPIAXd1x6jAJKOmUHBFns
+ewPHyGbdoGTtl8B47QLNyq/TeFoQ7rYmteLpa5aTAc+4sonB+TPKNbSuOjyW2YH
F+fr+rWvc3zLl5K76saP4wzUWHHFX7XRfqwW4sJGWpq0D3W6b3k=
-----END RSA PRIVATE KEY-----`;

/*────────────────────────────────────────────────────────────────────────────────────────*/

const output = new Object( );
const path = require('path'); 
const tls = require('tls');
const fs = require('fs'); 

/*────────────────────────────────────────────────────────────────────────────────────────*/

function SNI( cert, name, cb ){

    let ctx = undefined;

    if( !cert.cert && !cert.key ){

        if(!cert[name])
            throw new Error(`Not found SSL certificate for host: ${name}`);
            ctx = cert[name];

    } else  ctx = cert;

    if (cb)
        cb(null, cert[name]);
    else return cert[name];

}

function getSecureContexts(cert) {

    const certToReturn = new Object();

    if( !cert || Object.keys(cert).length === 0 ) {
        return null

    } else if( Object.keys(cert).length != 0 ) {

        if( !cert?.cert && !cert?.key ){
            for( const serverName of Object.keys(cert) ) {
                certToReturn[serverName] = tls.createSecureContext({
                    cert: fs.readFileSync(cert[serverName].cert),
                    key: fs.readFileSync(cert[serverName].key),
                });
            }

        } else {
            return {
                cert: fs.readFileSync(cert.cert),
                key: fs.readFileSync(cert.key),
            };
        }

    }

    certToReturn.SNICallback((name,cb)=>SNI(cert,name,cb));
    return certToReturn;
}

/*────────────────────────────────────────────────────────────────────────────────────────*/


output.default = ()=>{
    const SSL = cert.split('|'); 
    return {
        cert: SSL[0], key: SSL[1],
    };
}

output.parse = (key)=>{
    return getSecureContexts(key);
}

/*────────────────────────────────────────────────────────────────────────────────────────*/

module.exports = output;