export const defultBoardSetup = {
    /* https://en.wikipedia.org/wiki/Shogi */
    //sente
    "senteLanceOne":         ["19", "Lance"], 
    "senteKnightOne":        ["29", "Knight"], 
    "senteSilverGeneralOne": ["39", "SilverGeneral"], 
    "senteGoldGeneralOne":   ["49", "GoldGeneral"], 
    "senteKing":             ["59", "King"],
    "senteGoldGeneralTwo":   ["69", "GoldGeneral"], 
    "senteSilverGeneralTwo": ["79", "SilverGeneral"], 
    "senteKnightTwo":        ["89", "Knight"], 
    "senteLanceTwo":         ["99", "Lance"], 

    "senteRook":   ["28", "Rook"], 
    "senteBishop": ["88", "Bishop"], 

    "sentePawnOne":   ["17", "Pawn"], 
    "sentePawnTwo":   ["27", "Pawn"], 
    "sentePawnThree": ["37", "Pawn"], 
    "sentePawnFour":  ["47", "Pawn"], 
    "sentePawnFive":  ["57", "Pawn"], 
    "sentePawnSix":   ["67", "Pawn"], 
    "sentePawnSeven": ["77", "Pawn"], 
    "sentePawnEight": ["87", "Pawn"],
    "sentePawnNine":  ["97", "Pawn"],


    //gote
    "goteLanceOne":         ["91", "Lance"], 
    "goteKnightOne":        ["81", "Knight"], 
    "goteSilverGeneralOne": ["71", "SilverGeneral"], 
    "goteGoldGeneralOne":   ["61", "GoldGeneral"], 
    "goteKing":             ["51", "ChallengingKing"],
    "goteGoldGeneralTwo":   ["41", "GoldGeneral"], 
    "goteSilverGeneralTwo": ["31", "SilverGeneral"], 
    "goteKnightTwo":        ["21", "Knight"], 
    "goteLanceTwo":         ["11", "Lance"], 
    
    "goteRook":   ["82", "Rook"], 
    "goteBishop": ["22", "Bishop"], 
    
    "gotePawnOne":   ["93", "Pawn"], 
    "gotePawnTwo":   ["83", "Pawn"], 
    "gotePawnThree": ["73", "Pawn"], 
    "gotePawnFour":  ["63", "Pawn"], 
    "gotePawnFive":  ["53", "Pawn"], 
    "gotePawnSix":   ["43", "Pawn"], 
    "gotePawnSeven": ["33", "Pawn"], 
    "gotePawnEight": ["23", "Pawn"],
    "gotePawnNine":  ["13", "Pawn"]
};

export const defultStandSetups = {
    "sentePawnStand": ["p0", "Pawn"],
    "senteLanceStand": ["p1", "Lance"],
    "senteKnightStand": ["p2", "Knight"],
    "senteSilverGeneralStand": ["p3", "SilverGeneral"],
    "senteGoldenGeneral": ["p4", "GoldGeneral"],
    "senteRookStand": ["p5", "Rook"],
    "senteBishopStand": ["p6", "Bishop"],


    "gotePawnStand": ["o7", "Pawn"],
    "goteLanceStand": ["o8", "Lance"],
    "goteKnightStand": ["o9", "Knight"],
    "goteSilverGeneralStand": ["o10", "SilverGeneral"],
    "goteGoldenGeneral": ["o11", "GoldGeneral"],
    "goteRookStand": ["o12", "Rook"],
    "goteBishopStand": ["o13", "Bishop"]
};

export const picesImages = { 
    "King": "/pieces/syougi01_ousyou.png", 
    "ChallengingKing": "/pieces/syougi02_gyokusyou.png", 
    "GoldGeneral": "/pieces/syougi07_kinsyou.png", 
    "SilverGeneral": "/pieces/syougi08_ginsyou.png", 
    "Knight": "/pieces/syougi10_keima.png", 
    "Lance": "/pieces/syougi12_kyousya.png", 
    "Rook": "/pieces/syougi03_hisya.png", 
    "Bishop": "/pieces/syougi05_gakugyou.png", 
    "Pawn": "/pieces/syougi14_fuhyou.png", 

    // promotions
    "promotedSilverGeneral": "/pieces/syougi09_narigin.png", 
    "promotedKnight": "/pieces/syougi11_narikei.png", 
    "promotedLance": "/pieces/syougi13_narikyou.png", 
    "promotedRook": "/pieces/syougi04_ryuuou.png", 
    "promotedBishop": "/pieces/syougi06_ryuuma.png", 
    "promotedPawn": "/pieces/syougi15_tokin.png"
};