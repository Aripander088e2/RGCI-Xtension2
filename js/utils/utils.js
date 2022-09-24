Math.lerp = function (value1, value2, amount) {
	amount = amount < 0 ? 0 : amount;
	amount = amount > 1 ? 1 : amount;
	return value1 + (value2 - value1) * amount;
};

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}