var after = require('after');
var getTranslations = require('./parse-translation');
var luaEntitiesUtil = require('./lua-entities-util');

module.exports = {
  findMissingTooltips: findMissingTooltips
};

if (require.main === module) {
  findMissingTooltips(function (err, result) {
    console.log();
    if (err) {
      console.error(err);
      return;
    }
    if (result.length === 0) {
      console.log('Everything looks good!');
    }
  });
}

function findMissingTooltips (cb) {
  var translations = getTranslations(true);
  translations = Object.keys(translations.lang.Tokens.values).map(function (name) {
    return name.toLowerCase();
  });
  var result = [];

  var done = after(3, function (err) {
    cb(err, result);
  });

  luaEntitiesUtil.findAllUnits(function (err, data) {
    if (err) {
      console.log(err);
      return done(err);
    }
    data.map(function (name) {
      if (translations.indexOf(name) === -1) {
        console.log(name, 'is missing a title', Array(45 - name.length).join(' '), '- Add the key: "' + name + '"');
        result.push([name, name]);
      }
    });
    done();
  });

  luaEntitiesUtil.findAllAbilities(function (err, data) {
    if (err) {
      console.log(err);
      return done(err);
    }
    data.map(function (name) {
      var prefix = 'DOTA_Tooltip_Ability_';
      var title = prefix + name;
      var description = prefix + name + '_description';

      title = title.toLowerCase();
      description = description.toLowerCase();

      if (translations.indexOf(title) === -1) {
        console.log(name, 'is missing a title', Array(45 - name.length).join(' '), '- Add the key: "' + title + '"');
        result.push([name, title]);
      } else {
        // console.log(translations.lang.Tokens.values[title]);
      }
      if (translations.indexOf(description) === -1) {
        console.log(name, 'is missing a description', Array(39 - name.length).join(' '), '- Add the key: "' + description + '"');
        result.push([name, description]);
      }
    });
    done();
  });

  luaEntitiesUtil.findAllItems(function (err, data) {
    if (err) {
      console.log(err);
      return done(err);
    }
    data.map(function (name) {
      var prefix = 'DOTA_Tooltip_';
      var requiredTitle = !name.startsWith('item_recipe');
      var requiredDescription = (name.startsWith('item_') && !name.startsWith('item_recipe'));

      if (name.startsWith('item_')) {
        prefix = prefix + 'Ability_';
      }
      var title = prefix + name;
      var description = prefix + name + '_description';

      title = title.toLowerCase();
      description = description.toLowerCase();

      if (translations.indexOf(title) === -1 && requiredTitle) {
        console.log(name, 'is missing a title', Array(45 - name.length).join(' '), '- Add the key: "' + title + '"');
        result.push([name, title]);
      } else {
        // console.log(translations.lang.Tokens.values[title]);
      }
      if (translations.indexOf(description) === -1 && requiredDescription) {
        console.log(name, 'is missing a description', Array(39 - name.length).join(' '), '- Add the key: "' + description + '"');
        result.push([name, description]);
      }
    });
    done();
  });
}

