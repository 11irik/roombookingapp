
function ApplyTemplate(template, properties) {
    var returnValue = "";

    var templateFragments = template.split("{{");

    returnValue += templateFragments[0];

    for (var i = 1; i < templateFragments.length; i++) {
        var fragmentSections = templateFragments[i].split("}}", 2);
        returnValue += properties[fragmentSections[0]] ? properties[fragmentSections[0]] : '';
        returnValue += fragmentSections[1];
    }

    return returnValue;
}

module.exports = {
    ApplyTemplate
}