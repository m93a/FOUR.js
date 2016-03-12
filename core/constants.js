(function(global){ "use strict";

var FOUR = global.FOUR = global.FOUR || Object.create(null);


//Enum faces
//the sur- names borrowed from os2fan2.com/gloss/pglosss.html#pgsurtope

FOUR.NONE            = 0;
FOUR.VERTICES        = 1<<0;
FOUR.SURTEELA        = 1<<0;
FOUR.EDGES           = 1<<1;
FOUR.SURLATRA        = 1<<1;
FOUR.POLYGONAL_FACES = 1<<2;
FOUR.SURHEDRA        = 1<<2;
FOUR.CELLS           = 1<<3;
FOUR.SURCHORA        = 1<<3;
FOUR.SURTERA         = 1<<4;
FOUR.SURPETA         = 1<<5;
FOUR.SURECTA         = 1<<6;
FOUR.SURZETTA        = 1<<7;
FOUR.SURYOTTA        = 1<<8;
FOUR.ALL             = 2*(1<<30)-1;

})(this);