function roundNumber(number, cases) {
    var t = Math.pow(10, cases);
    return Math.round(number*t)/t;
}

function getDistributionFunction(functionNumber) {
    var constant = function(a) {
        "use strict";
        return a;
    }

    var uniform = function(a, b) {
        "use strict";
        var r = Math.random();
        return a + ((b - a) * r);
    }

    var triangular = function(a,b,c) {
        "use strict";
        this.limit = (b - a) / (c - a);
        var r = Math.random();
        var aux;

        if(r >= 0 && r <= limit){
            aux = r * (b - a) * (c - a);
            return a + Math.sqrt(aux);
        }
        aux = (1 - r) * (c - b) * (c - a);
        return c - Math.sqrt(aux);
    }

    var exponencial = function(a){ 
        "use strict";
        var r = Math.random();
        return -a * (Math.log(1 - r));
    }

    var normal = function(u, o) {
        "use strict";
        var z = new Ziggurat();

        return u + (o * z.nextGaussian());
    }

    //https://www.filosophy.org/post/35/normaldistributed_random_values_in_javascript_using_the_ziggurat_algorithm/
    function Ziggurat() {
        "use strict";
        var jsr = 123456789;

        var wn = Array(128);
        var fn = Array(128);
        var kn = Array(128);

        function RNOR(){
          var hz = SHR3();
          var iz = hz & 127;
          return (Math.abs(hz) < kn[iz]) ? hz * wn[iz] : nfix(hz, iz);
        }

        this.nextGaussian = function(){
          return RNOR();
        }

        function nfix(hz, iz){
          var r = 3.442619855899;
          var r1 = 1.0 / r;
          var x;
          var y;
          while(true){
            x = hz * wn[iz];
            if( iz == 0 ){
              x = (-Math.log(UNI()) * r1);
              y = -Math.log(UNI());
              while( y + y < x * x){
                x = (-Math.log(UNI()) * r1);
                y = -Math.log(UNI());
              }
              return ( hz > 0 ) ? r+x : -r-x;
            }

            if( fn[iz] + UNI() * (fn[iz-1] - fn[iz]) < Math.exp(-0.5 * x * x) ){
               return x;
            }
            hz = SHR3();
            iz = hz & 127;

            if( Math.abs(hz) < kn[iz]){
              return (hz * wn[iz]);
            }
          }
        }

        function SHR3(){
          var jz = jsr;
          var jzr = jsr;
          jzr ^= (jzr << 13);
          jzr ^= (jzr >>> 17);
          jzr ^= (jzr << 5);
          jsr = jzr;
          return (jz+jzr) | 0;
        }

        function UNI(){
          return 0.5 * (1 + SHR3() / -Math.pow(2,31));
        }

        function zigset(){
          // seed generator based on current time
          jsr ^= new Date().getTime();

          var m1 = 2147483648.0;
          var dn = 3.442619855899;
          var tn = dn;
          var vn = 9.91256303526217e-3;

          var q = vn / Math.exp(-0.5 * dn * dn);
          kn[0] = Math.floor((dn/q)*m1);
          kn[1] = 0;

          wn[0] = q / m1;
          wn[127] = dn / m1;

          fn[0] = 1.0;
          fn[127] = Math.exp(-0.5 * dn * dn);

          for(var i = 126; i >= 1; i--){
            dn = Math.sqrt(-2.0 * Math.log( vn / dn + Math.exp( -0.5 * dn * dn)));
            kn[i+1] = Math.floor((dn/tn)*m1);
            tn = dn;
            fn[i] = Math.exp(-0.5 * dn * dn);
            wn[i] = dn / m1;
          }
        }
        zigset();
    }
    
    switch(functionNumber) {
        case Function.NUMBER.CONSTANT:
            return constant;
        case Function.NUMBER.EXPONENCIAL:
            return exponencial;
        case Function.NUMBER.NORMAL:
            return normal;
        case Function.NUMBER.TRIANGULAR:
            return triangular;
        case Function.NUMBER.UNIFORM:
            return uniform;
    }
}


