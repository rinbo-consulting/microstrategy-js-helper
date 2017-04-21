(function(mojo, packageName) {
  mojo.plugins[packageName] = {};
  $$ = mojo.plugins[packageName];
  $$.loggingFlag = true;
  $$.log = function(message, logger) {
    if ($$.loggingFlag) {
      if (!logger) {
        logger = "An unidentified function";
      }
      console.log(logger + " says: " + message);
    }
  };

  $$.getLoggableFunction = function(func, name) {
    return function() {
      if ($$.loggingFlag) {
        var logText = name + "(";

        for (var i = 0; i < arguments.length; i++) {
          if (i > 0) {
            logText += ", ";
          }
          logText += arguments[i];
        }
        logText += ");";

        $$.log(logText);
      }

      return func.apply(this, arguments);
    };
  };

  $$.addLoggingToNamespace = function(namespaceObject) {
    for (var name in namespaceObject) {
      var potentialFunction = namespaceObject[name];

      if (
        Object.prototype.toString.call(potentialFunction) ===
        "[object Function]"
      ) {
        namespaceObject[name] = $$.getLoggableFunction(potentialFunction, name);
      }
    }
  };

  $$.MicroStrategyObjectTypes = {
    Panel: "mstrmojo.ExpressDocPanel",
    DocTextField: "mstrmojo.DocTextfield",
    ListDocSelector: "mstrmojo.ListDocSelector",
    VITab: "mstrmojo.vi.ui.tabs.Tab",
    DocLayoutViewer: "mstrmojo.DocLayoutViewer"
  };

  $$.setupJQuery = function(callback) {
    var scriptsToLoad = [];
    if ($() && $().jquery) {
      $$.log("jQuery is already loaded.", "setupJQuery");
    } else {
      scriptsToLoad.push({ url: "//code.jquery.com/jquery-1.11.2.min.js" });
    }
    if (scriptsToLoad.length > 0) {
      mojo._LoadsScript.requiresExternalScripts(scriptsToLoad, callback);
    } else if (callback) {
      callback.call();
    }
  };
  $$.getObjectsByTypeAndName = function(type, name) {
    var objs = [];
    for (var key in mojo.all) {
      var obj = mojo.all[key];
      if (obj.scriptClass == type) {
        if (obj.defn.n == name || !name) {
          objs.push(obj);
        }
      }
    }
    if (objs.length == 1) {
      return objs[0];
    } else {
      return objs;
    }
  };

  $$.getTextBoxByName = function(name) {
    return $$.getObjectsByTypeAndName(
      $$.MicroStrategyObjectTypes.DocTextField,
      name
    );
  };

  $$.getSelectorByName = function(name) {
    return $$.getObjectsByTypeAndName(
      $$.MicroStrategyObjectTypes.ListDocSelector,
      name
    );
  };
  $$.getDocLayoutViewer = function() {
    return $$.getObjectsByTypeAndName(
      $$.MicroStrategyObjectTypes.DocLayoutViewer
    );
  };
  $$.runPostRender = function(callback) {
    $$.getDocLayoutViewer().attachEventListener(
      "renderComplete",
      null,
      callback
    );
  };

  $$.show = function(obj) {
    if (obj.domNode) {
      obj.domNode.style.visibility = "visible";
    }
  };

  $$.hide = function(obj) {
    if (obj.domNode) {
      obj.domNode.style.visibility = "hidden";
    }
  };

  $$.selectVITabByName = function(tabName) {
    for (var key in mojo.all) {
      var obj = mojo.all[key];
      if (obj.scriptClass == $.MicroStrategyObjectTypes.VITab) {
        if (obj.title == tabName) {
          $$.log("Switching to tab: " + tabName, "selectVITabByName");
        } else {
          $$.log(
            value.title + " != " + tabName + ". Move along.",
            "selectVITabByName"
          );
        }
      }
    }
  };
  $$.selectVITabByNumber = function(tabNumber) {
    var counter = 0;
    for (var key in mojo.all) {
      var obj = mojo.all[key];
      if (obj.scriptClass == $.MicroStrategyObjectTypes.VITab) {
        counter++;
        if (counter == tabNumber) {
          $$.log("Switching to tab no: " + tabNumber, "selectVITabByName");
        } else {
          $$.log(
            "The number" +
              counter +
              " != the number " +
              tabNumber +
              ". Move along.",
            "selectVITabByName"
          );
        }
      }
    }
  };
})(mstrmojo, "jshelper");
