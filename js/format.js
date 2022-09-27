const ST_NAMES = [
	null, [
		["","U","D","T","Qa","Qt","Sx","Sp","Oc","No"],
		["","Dc","Vg","Tg","Qag","Qtg","Sxg","Spg","Ocg","Nog"],
		["","Ce","De","Te","Qae","Qte","Sxe","Spe","Oce","Noe"],
	],[
		["","Mi","Mc","Na","Pc","Fm","At","Zp","Yc","Xn"],
		["","Me","Du","Tr","Te","Pe","He","Hp","Ot","En"],
		["","c","Ic","TCn","TeC","PCn","HCn","HpC","OCn","ECn"],
		["","Hc","DHe","THt","TeH","PHc","HHe","HpH","OHt","EHc"]
	]
]

const FORMATS = {
    mixed_sc: {
      format(ex, acc) {
        ex = E(ex)
        let e = ex.log10().floor()
        if (e.gte(6) && e.lt(36)) return format(ex,acc,"st")
        else return format(ex,acc,"sc")
      }
    },
    standard: {
      tier1(x) {
        return ST_NAMES[1][0][x % 10] +
        ST_NAMES[1][1][Math.floor(x / 10) % 10] +
        ST_NAMES[1][2][Math.floor(x / 100)]
      },
      tier2(x) {
        let o = x % 10
        let t = Math.floor(x / 10) % 10
        let h = Math.floor(x / 100) % 10
  
        let r = ''
        if (x < 10) return ST_NAMES[2][0][x]
        if (t == 1 && o == 0) r += "Vec"
        else r += ST_NAMES[2][1][o] + ST_NAMES[2][2][t]
        r += ST_NAMES[2][3][h]
  
        return r
      },
    }
}


const INFINITY_NUM = E(2).pow(1024);
const SUBSCRIPT_NUMBERS = "₀₁₂₃₄₅₆₇₈₉";
const SUPERSCRIPT_NUMBERS = "⁰¹²³⁴⁵⁶⁷⁸⁹";

function toSubscript(value) {
    return value.toFixed(0).split("")
      .map((x) => x === "-" ? "₋" : SUBSCRIPT_NUMBERS[parseInt(x, 10)])
      .join("");
}

function toSuperscript(value) {
    return value.toFixed(0).split("")
      .map((x) => x === "-" ? "₋" : SUPERSCRIPT_NUMBERS[parseInt(x, 10)])
      .join("");
}

function format(ex, acc=2, type) {
    ex = E(ex)
    neg = ex.lt(0)?"-":""

    if (ex.mag == Infinity) return neg + 'Infinity'
    if (Number.isNaN(ex.mag)) return neg + 'NaN'
    if (ex.lt(0)) ex = ex.mul(-1)
    if (ex.eq(0)) return ex.toFixed(acc)
    let e = ex.log10().floor()

	if (!type) type = player.options.scientific ? "sc" : "mixed_sc"
    switch (type) {
        case "sc":
            if (e.lt(6)) {
                let a = Math.max(Math.min(acc-e.toNumber(), acc), 0)
                return neg+(a>0?ex.toFixed(a):ex.toFixed(a).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'))
            } else {
                if (ex.gte("eeee10")) {
                    let slog = ex.slog()
                    return (slog.gte(1e9)?'':E(10).pow(slog.sub(slog.floor())).toFixed(2)) + "F" + format(slog.floor(), 0)
                }
                let m = ex.div(E(10).pow(e))
                let be = e.log10().gte(9)
                return neg+(be?'':m.toFixed(2))+'e'+format(e, 0, "mixed_sc")
            }
        case "st":
            let e3 = ex.log(1e3).floor()
            if (e3.lt(1)) {
              return neg+ex.toFixed(Math.max(Math.min(acc-e.toNumber(), acc), 0))
            } else {
              let e3_mul = e3.mul(3)
              let ee = e3.log10().floor()
              if (ee.gte(3000)) return "e"+format(e, acc, "st")

              let final = ""
              if (e3.lt(4)) final = ["", "K", "M", "B"][Math.round(e3.toNumber())]
              else {
                let ee3 = Math.floor(e3.log(1e3).toNumber())
                if (ee3 < 100) ee3 = Math.max(ee3 - 1, 0)
                e3 = e3.sub(1).div(E(10).pow(ee3*3))
                while (e3.gt(0)) {
                  let div1000 = e3.div(1e3).floor()
                  let mod1000 = e3.sub(div1000.mul(1e3)).floor().toNumber()
                  if (mod1000 > 0) {
                    if (mod1000 == 1 && !ee3) final = "U"
                    if (ee3) final = FORMATS.standard.tier2(ee3) + (final ? "-" + final : "")
                    if (mod1000 > 1) final = FORMATS.standard.tier1(mod1000) + final
                  }
                  e3 = div1000
                  ee3++
                }
              }

              let m = ex.div(E(10).pow(e3_mul))
              return neg+(ee.gte(10)?'':(m.toFixed(E(2).sub(e.sub(e3_mul)).add(1).toNumber()))+' ')+final
            }
        default:
            return neg+FORMATS[type].format(ex, acc)
    }
}

function formatGain(amt, gain) {
    let next = amt.add(gain)
    let rate
    let ooms = next.div(amt)
    if (ooms.gte(10) && amt.gte(1e100)) {
        ooms = ooms.log10().mul(20)
        rate = "(+"+format(ooms) + " OoMs/sec)"
    }
    else rate = "(+"+format(gain)+"/sec)"
    return rate
}

function formatTime(ex,acc=2,type="s") {
    ex = E(ex)
    if (ex.gte(86400)) return format(ex.div(86400).floor(),0,"sc")+":"+formatTime(ex.mod(86400),acc,'d')
    if (ex.gte(3600)||type=="d") return (ex.div(3600).gte(10)||type!="d"?"":"0")+format(ex.div(3600).floor(),0,"sc")+":"+formatTime(ex.mod(3600),acc,'h')
    if (ex.gte(60)||type=="h") return (ex.div(60).gte(10)||type!="h"?"":"0")+format(ex.div(60).floor(),0,"sc")+":"+formatTime(ex.mod(60),acc,'m')
    return (ex.gte(10)||type!="m" ?"":"0")+format(ex,acc,"sc")
}

function formatReduction(ex) { ex = E(ex); return format(E(1).sub(ex).mul(100))+"%" }

function formatPercent(ex) { ex = E(ex); return format(ex.mul(100))+"%" }

function formatMult(ex,acc=2) { ex = E(ex); return ex.gte(1)?"×"+ex.format(acc):"/"+ex.pow(-1).format(acc)}

function expMult(a,b,base=10) { return Decimal.gte(a,10) ? Decimal.pow(base,Decimal.log(a,base).pow(b)) : E(a) }