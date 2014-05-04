var initialize = function(){
	var prefix = '',
	allData,
	firstCountry,
	secondCountry,
	firstData,
	secondData,
	currentData;
	setUpSubmit();
	loadAllData();
	hideShowCard($('#card_1'));
};

var setUpSubmit = function (){
	$('a[name="card_2"]').click(onSubmit);
	$('.next_button').not('.main_button').click(advanceCard);
	$('.country_list').first().find('li').click(function(){
		if (!$(this).hasClass('active')) {
		
		firstCountry = $(this).attr('id').replace('_first_1', '')
				$('#' + firstCountry + '_second_2').addClass('active');

		$('.country_list').first().find('li').addClass('active');
		$(this).removeClass('active');
	}
	})
	$('.country_list').last().find('li').click(function(){
		if (!$(this).hasClass('active')) {
		
		secondCountry = $(this).attr('id').replace('_second_2', '')
				$('#' + secondCountry + '_first_1').addClass('active');
		$('.country_list').last().find('li').addClass('active');
		$(this).removeClass('active');
	}
	})

	if ($('.country_list').first().find('li.active').length) {
		firstCountry = $('.country_list').first().find('li.active').attr('id').replace('_first_1', '')
	}

	if ($('.country_list').last().find('li.active').length) {
		secondCountry = $('.country_list').last().find('li.active').attr('id').replace('_second_2', '')
	}
}



var loadAllData = function() {
	$.ajax({
  		url: "meat_data.json"
	}).success(function(data) {
  		allData = data;
	});
};

var selectData = function(prefix) {
	$.each(allData, function(index, item) {
		if (index.indexOf(countryLookup(prefix)) != -1) {
			currentData = allData[index];
		}
	})
	return currentData
};

var foodLookup = {
	'wheat': 'wheat',
	'cows': 'cow',
	'potatoes': 'potato',
	'fish': 'fish',
	'pigs': 'pig',
	'vegetables': 'vegetable',
	'chickens ': 'chicken',
	'rice': 'rice',
	'goats': 'goat'
}
var cardVisualization = {
	2: 'icons',
	3: 'bar',
	4: 'size',
	5: 'size',
	6: 'size',
	7: 'size',
	8: 'size',
	9: 'size',
	10: 'size'
};

var dataKeys = {
	2: 'population',
	3: 'income',
	4: 'protein',
	5: 'land_use_per_capita',
	6: 'water_footprint_per_capita',
	7: 'emissions_footprint_per_capita',
	8: 'fat',
	9: 'protein',
	10: 'kcal/day'
};

var countryLookup = function(prefix){
	var lookup = {
	'unitedstates': 'United States of America',
	'china': 'China',
	'brazil': 'Brazil',
	'japan': 'Japan',
	'tanzania': 'United Republic of Tanzania',
	'world': 'World'
}
return lookup[prefix]
};

var displayLookup = function(prefix){
	var lookup = {
	'unitedstates': 'the United States',
	'china': 'China',
	'brazil': 'Brazil',
	'japan': 'Japan',
	'tanzania': 'the United Republic of Tanzania',
	'world': 'the entire world'
}
return lookup[prefix]
};

var makeBarChart = function(item, dataKey, firstData, secondData){
	firstIncomePercent = 50;
	$('.bar_container').find('.first_country').css('width', firstIncomePercent + '%')
	$('.bar_container').find('.second_country').css('width', firstIncomePercent + '%')
	$('.country_percentage').html(firstIncomePercent + '%')
	$('#card_3_head span').html(displayLookup(firstCountry))
}

var adjustBarChart = function(){
	secondIncomePercent = 75;
	$('.bar_container').find('.second_country').animate({'width': secondIncomePercent + '%'}, 1500)
	var diff = secondIncomePercent - firstIncomePercent;
	if (diff >= 0) {
		var diffLabel = 'Increased'
	} else {
		var diffLabel = 'Decreased'
	}
	$('.country_percentage').html(diffLabel + ' ' + diff + ' percentage points<br> (from ' + String(firstIncomePercent) + '% to ' + String(secondIncomePercent) + '%)')
}

var onSubmit = function(){
	event.preventDefault();
	if (typeof(firstCountry) === 'undefined') {
		alert('Select a country from the first row.')
		return false;
	} else if (typeof(secondCountry) === 'undefined') {
		alert('Select a country from the second row.')
		return false;
	} else {
		$.each($('.content_card'), function(index, item) {
		firstData = selectData(firstCountry);
		secondData = selectData(secondCountry);
			cardNumber = $(item).attr('id').replace('card_', '');
			cardVizType = cardVisualization[cardNumber];
			if (cardVizType == 'icons') {
				list = [];
				list.push(Number(firstData[dataKeys[cardNumber]]))
				list.push(Number(secondData[dataKeys[cardNumber]]))
				maxNumber = list.sort(function(a, b){return a-b}).reverse()[0]
				addMultipleIconsPopulation(item, dataKeys[cardNumber], firstData, secondData, null, maxNumber);
			} else if (cardVizType === 'size') {
				setUpCircle(item, dataKeys[cardNumber], firstData, secondData);
			} else if (cardVizType === 'bar') {
				makeBarChart(item, dataKeys[cardNumber], firstData, secondData);
			};
		});	
	}
	
	hideShowCard($('#card_2'), firstData, secondData);
};

var addMultipleIconsStart = function(element, key, firstData, secondData, iconNumber, maxNumber) {
	oldIconNumber = iconNumber || Number((firstData[key]).toFixed(0));
	if (maxNumber) {
		ratio = oldIconNumber/maxNumber
		arrayNumber = ratio * 2000
} else {
	arrayNumber = oldIconNumber
}
arrayNumber = Number(arrayNumber.toFixed(0))
	console.log(oldIconNumber, maxNumber, arrayNumber)
	var array = new Array(arrayNumber);
	$(element).find('.icon').remove();

	$.each(array, function(index, item){
		$(element).find('.item_icons').prepend('<div class="icon"></div>')
	})
};

var addMultipleIconsPopulation= function(element, key, firstData, secondData, iconNumber, maxNumber) {
		ratio = firstData.population/maxNumber
		arrayNumber = ratio * 2000

arrayNumber = Number(arrayNumber.toFixed(0))
	var array = new Array(arrayNumber);
	$('#card_2_pop1').next().find('.icon').remove();
	$.each(array, function(index, item) {
	$('#card_2_pop1').next().prepend('<div class="icon"></div>')

	})

ratio = secondData.population/maxNumber
		arrayNumber = ratio * 2000

arrayNumber = Number(arrayNumber.toFixed(0))
	var array = new Array(arrayNumber);
	$('#card_2_pop2').next().find('.icon').remove();
		$.each(array, function(index, item) {

	$('#card_2_pop2').next().prepend('<div class="icon"></div>')
})
	$('#card_2_text').html('Each icon equals ' + addCommas(maxNumber/2000) + ' people.')
	$('#card_2_pop1').html('Population of ' + displayLookup(firstCountry))
	$('#card_2_pop2').html('Population of ' + displayLookup(secondCountry))
};

var addMultipleIconsEnd = function(element, key, firstData, secondData, iconNumber, maxNumber) {
			$(element).find('.item_icons').find('.icon-added').remove()
			$(element).find('.item_icons').find('item-subtracted').remove()
	var diff = secondData.foods[key] - firstData.foods[key]
	if (maxNumber) {
		ratio = firstData.foods[key]/maxNumber;
		oldArrayNumber = ratio * 2000
		newArrayNumber = (secondData.foods[key]/maxNumber) * 2000
} 
arrayNumber = Number((newArrayNumber - oldArrayNumber).toFixed(0))
	var array = new Array(Math.abs(arrayNumber));
	$.each(array, function(index, item){
		if (diff > 0) {
			$(element).find('.item_icons .clear').before('<div class="icon_added icon"></div>')
		}
		else {
			$('#card_' + cardNumber).find('.item_icons .icon').slice(diff).addClass('icon_subtracted');
		}
	})
};

function addCommas(nStr)
{
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

var setUpCircle = function(item, key, firstData, secondData) {
	function increaseOrDecrease() {
		diff = secondData[key] - firstData[key];
 		if (diff >= 0) {
			return 'more'
		} else {
			return 'fewer'
		}
	}
	$($(item).find('span')[1]).html(displayLookup(firstCountry))
	$($(item).find('span')[2]).html(addCommas(Math.abs(secondData[key] - firstData[key]))+ ' ')
	$($(item).find('span')[3]).html(increaseOrDecrease())
	$($(item).find('span')[4]).html(displayLookup(secondCountry))
	var circleSize =200;
	$(item).find('.sizer_initial').css({width: circleSize, height: circleSize})
	$(item).find('.sizer').css({width: circleSize, height: circleSize})
};

var makeBigger = function(elementSelector, key) {
	var ratio = secondData[key]/firstData[key]
	var secondDataItem = ratio /(1/200);
	if (!secondDataItem) secondDataItem = 10;
	circleSize = ratio * secondDataItem;
	$(elementSelector).find('.sizer').animate({width: circleSize + 'px', height: circleSize + 'px'}, 3000)
};

var advanceCard = function(event){
	event.preventDefault();
	var currentlyShownCard = $('.content_card:visible');
	var currentlyShownCardNumber = currentlyShownCard.attr('id').replace('card_', '')
	if (currentlyShownCardNumber === "3") {
		newCardToShow = $('#card_x')
	} else if (currentlyShownCardNumber === 'x') {
		newCardToShow = $('#card_5')
	} else {
	var newCardNumber = Number(currentlyShownCardNumber) +1
	var newCardToShow = $('#card_' + newCardNumber);	
	}
	
	if ($(newCardToShow).length == 1) {
		hideShowCard(newCardToShow);
	} else {
		hideShowCard($('#card_1'));
		firstCountry = undefined;
		secondCountry = undefined;
	}
};

var displayFoods = function() {
	var numberList = [];
	$.each(firstData.foods, function(index, item) {
		numberList.push(Number(item));
	})
	$.each(secondData.foods, function(index, item) {
		numberList.push(Number(item));
	})

	$('.foods_list li').click(function(){
		var text = $(this).text();
		if (text.slice(-1) === 's') {
			console.log('change key')
			key = text.substring(0, text.length - 1)
			console.log(key)
		} else {
			key = text
		}
		console.log(text)
		$('.commodities').hide();
		$('#'+ text).fadeIn(1000, function(){
			addMultipleIconsEnd($('#'+ text), foodLookup[text], firstData, secondData, Number((firstData.foods[foodLookup[text]]).toFixed(0)), maxNumber)
		});
	})

	numberList = numberList.sort(function(a, b){return a-b})
	maxNumber = numberList.reverse()[0];
	addMultipleIconsStart($('#wheat'), 'foods["wheat"]', firstData, secondData, Number((firstData.foods.wheat).toFixed(0)), maxNumber);
	addMultipleIconsStart($('#cows'), 'foods["cows"]', firstData, secondData, Number((firstData.foods.cow).toFixed(0)), maxNumber);
	addMultipleIconsStart($('#potatoes'), 'foods["potatoes"]', firstData, secondData, Number((firstData.foods.potato).toFixed(0)), maxNumber);
	addMultipleIconsStart($('#fish'), 'foods["fish"]', firstData, secondData, Number((firstData.foods.fish).toFixed(0)), maxNumber);
	addMultipleIconsStart($('#pigs'), 'foods["pigs"]', firstData, secondData, Number((firstData.foods.pig).toFixed(0)), maxNumber);
	addMultipleIconsStart($('#vegetables'), 'foods["vegetables"]', firstData, secondData, Number((firstData.foods.vegetable).toFixed(0)), maxNumber);
	addMultipleIconsStart($('#chickens'), 'foods["chickens"]', firstData, secondData, Number((firstData.foods.chicken).toFixed(0)), maxNumber);
	addMultipleIconsStart($('#rice'), 'foods["rice"]', firstData, secondData, Number((firstData.foods.rice).toFixed(0)), maxNumber);
	addMultipleIconsStart($('#goat'), 'foods["goat"]', firstData, secondData, Number((firstData.foods.goat).toFixed(0)), maxNumber);
$('.foods_list li').first().click();
};



var hideShowCard = function(cardElement, firstData, secondData) {
	$('.content_card').hide();
	cardElement.fadeIn(1500, function(){
		cardNumber = cardElement.attr('id').replace('card_', '')
		if (cardVisualization[cardNumber] === 'icons') {
		//	addMultipleIconsEnd(cardElement, dataKeys[cardNumber], firstData, secondData)
		} else if (cardVisualization[cardNumber] === 'size') {
			makeBigger(cardElement, dataKeys[cardNumber], firstData, secondData);
		} else if (cardVisualization[cardNumber] === 'bar') {
			adjustBarChart(cardElement, dataKeys[cardNumber], firstData, secondData);
		}
		if (cardNumber === "1") {
	//	$('.country_list').first().find('li').addClass('active');
	//	$('.country_list').last().find('li').addClass('active');
		}
		if (cardNumber === "x") {
			displayFoods();
		}
	});
	
};

$(initialize);