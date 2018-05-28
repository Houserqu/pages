/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "0fb600578e1200c3cb64"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) me.children.push(request);
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (typeof dep === "undefined") hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (typeof dep === "undefined") hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle")
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			{
/******/ 				// eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted
/******/ 			)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/js/index.js")(__webpack_require__.s = "./src/js/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/css-loader/index.js!./node_modules/less-loader/dist/cjs.js!./src/stylesheet/main.less":
/*!***************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/less-loader/dist/cjs.js!./src/stylesheet/main.less ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(/*! ../../node_modules/css-loader/lib/url/escape.js */ "./node_modules/css-loader/lib/url/escape.js");
exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "body {\n  background: #F2F2F2;\n  font-family: 'Sunflower', sans-serif;\n}\n.box-border {\n  border: 3px solid #D9E3F0;\n  border-radius: 10px;\n}\n#container {\n  padding: 100px;\n  background-color: #fff;\n  width: 1400px;\n  height: 1300px;\n  margin: auto;\n  display: flex;\n}\n#left {\n  flex: 1;\n}\n#right {\n  flex: 1;\n}\n#colors {\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 50px;\n}\n#colors .color-block {\n  height: 120px;\n  width: 120px;\n  border-radius: 8px;\n}\n#colors .color-1 {\n  background: #2CCCE4;\n}\n#colors .color-2 {\n  background: #37D67A;\n}\n#colors .color-3 {\n  background: #697689;\n}\n#colors .color-4 {\n  background: #D9E3F0;\n}\n.typemodal {\n  border: 3px solid #D9E3F0;\n  border-radius: 10px;\n  padding: 50px;\n}\n.typemodal h2 {\n  font-size: 38px;\n}\n.typemodal .subtitle {\n  color: #D9E3F0;\n}\n.typemodal .content {\n  font-size: 30px;\n  line-height: 50px;\n}\n#buttons button {\n  margin: 20px 50px;\n  outline: none;\n}\n#buttons .button {\n  width: 240px;\n  height: 100px;\n  border: 4px solid;\n  border-radius: 8px;\n  font-size: 30px;\n  cursor: pointer;\n}\n#buttons .primary {\n  background: #2CCCE4;\n  color: #fff;\n  border-color: #2CCCE4;\n}\n#buttons .primary:hover {\n  background-color: #86e2f0;\n}\n#buttons .primary-empty {\n  background: #fff;\n  color: #2CCCE4;\n  border-color: #2CCCE4;\n}\n#buttons .primary-empty:hover {\n  background-color: #f8f8f9;\n}\n#buttons .info {\n  background: #37D67A;\n  color: #fff;\n  border-color: #37D67A;\n}\n#buttons .info:hover {\n  background-color: #8ce7b2;\n}\n#buttons .info-empty {\n  background: #fff;\n  color: #37D67A;\n  border-color: #37D67A;\n}\n#buttons .info-empty:hover {\n  background-color: #f8f8f9;\n}\n#buttons .disable {\n  background: #697689;\n  color: #fff;\n  border-color: #697689;\n}\n#buttons .disable:hover {\n  background-color: #a1aab7;\n}\n#buttons .disable-empty {\n  background: #fff;\n  color: #697689;\n  border-color: #697689;\n}\n#buttons .disable-empty:hover {\n  background-color: #f8f8f9;\n}\n#forms {\n  margin-left: 50px;\n  margin-top: 20px;\n}\n#forms input {\n  margin-bottom: 50px;\n  outline: none;\n}\n#forms .text {\n  width: 530px;\n  height: 100px;\n  line-height: 100px;\n  font-size: 30px;\n  border: 3px solid #D9E3F0;\n  border-radius: 10px;\n  padding-left: 30px;\n  color: #D9E3F0;\n}\n#forms .text::placeholder {\n  color: #D9E3F0;\n}\n#forms .disable {\n  border-color: #D9E3F0;\n  color: #D9E3F0;\n}\n#forms .wrong {\n  border-color: #F47373;\n  color: #F47373;\n}\n#forms .typed {\n  border-color: #2CCCE4;\n  color: #2CCCE4;\n}\n.switch {\n  display: inline-block;\n  width: 100px;\n  height: 50px;\n  background-color: #D9E3F0;\n  border-radius: 25px;\n  user-select: none;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  position: relative;\n  transition: background-color 0.5s;\n  outline: none;\n}\n.switch::before {\n  content: '';\n  position: absolute;\n  height: 40px;\n  width: 40px;\n  border-radius: 50%;\n  background-color: #fff;\n  top: 5px;\n  left: 5px;\n  transition: left 0.5s;\n}\n.switch:checked {\n  background-color: #37D67A;\n}\n.switch:checked:before {\n  content: '';\n  position: absolute;\n  height: 40px;\n  width: 40px;\n  border-radius: 50%;\n  background-color: #fff;\n  top: 5px;\n  left: 55px;\n}\n#top {\n  margin-left: 50px;\n  display: flex;\n  margin-bottom: 50px;\n}\n.ranger {\n  overflow: hidden;\n  -webkit-appearance: none;\n  outline: none;\n  width: 350px;\n  height: 100%;\n  min-height: 40px;\n}\n.ranger::-webkit-slider-runnable-track {\n  height: 6px;\n  content: '';\n  background-color: #2CCCE4;\n}\n.ranger::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  background-color: #fff;\n  height: 30px;\n  width: 30px;\n  border-radius: 50%;\n  border: 4px solid #2CCCE4;\n  margin-top: -12px;\n  margin-bottom: -5px;\n  box-shadow: 1px 0 0 -12px #c7c7c7, 2px 0 0 -12px #c7c7c7, 3px 0 0 -12px #c7c7c7, 4px 0 0 -12px #c7c7c7, 5px 0 0 -12px #c7c7c7, 6px 0 0 -12px #c7c7c7, 7px 0 0 -12px #c7c7c7, 8px 0 0 -12px #c7c7c7, 9px 0 0 -12px #c7c7c7, 10px 0 0 -12px #c7c7c7, 11px 0 0 -12px #c7c7c7, 12px 0 0 -12px #c7c7c7, 13px 0 0 -12px #c7c7c7, 14px 0 0 -12px #c7c7c7, 15px 0 0 -12px #c7c7c7, 16px 0 0 -12px #c7c7c7, 17px 0 0 -12px #c7c7c7, 18px 0 0 -12px #c7c7c7, 19px 0 0 -12px #c7c7c7, 20px 0 0 -12px #c7c7c7, 21px 0 0 -12px #c7c7c7, 22px 0 0 -12px #c7c7c7, 23px 0 0 -12px #c7c7c7, 24px 0 0 -12px #c7c7c7, 25px 0 0 -12px #c7c7c7, 26px 0 0 -12px #c7c7c7, 27px 0 0 -12px #c7c7c7, 28px 0 0 -12px #c7c7c7, 29px 0 0 -12px #c7c7c7, 30px 0 0 -12px #c7c7c7, 31px 0 0 -12px #c7c7c7, 32px 0 0 -12px #c7c7c7, 33px 0 0 -12px #c7c7c7, 34px 0 0 -12px #c7c7c7, 35px 0 0 -12px #c7c7c7, 36px 0 0 -12px #c7c7c7, 37px 0 0 -12px #c7c7c7, 38px 0 0 -12px #c7c7c7, 39px 0 0 -12px #c7c7c7, 40px 0 0 -12px #c7c7c7, 41px 0 0 -12px #c7c7c7, 42px 0 0 -12px #c7c7c7, 43px 0 0 -12px #c7c7c7, 44px 0 0 -12px #c7c7c7, 45px 0 0 -12px #c7c7c7, 46px 0 0 -12px #c7c7c7, 47px 0 0 -12px #c7c7c7, 48px 0 0 -12px #c7c7c7, 49px 0 0 -12px #c7c7c7, 50px 0 0 -12px #c7c7c7, 51px 0 0 -12px #c7c7c7, 52px 0 0 -12px #c7c7c7, 53px 0 0 -12px #c7c7c7, 54px 0 0 -12px #c7c7c7, 55px 0 0 -12px #c7c7c7, 56px 0 0 -12px #c7c7c7, 57px 0 0 -12px #c7c7c7, 58px 0 0 -12px #c7c7c7, 59px 0 0 -12px #c7c7c7, 60px 0 0 -12px #c7c7c7, 61px 0 0 -12px #c7c7c7, 62px 0 0 -12px #c7c7c7, 63px 0 0 -12px #c7c7c7, 64px 0 0 -12px #c7c7c7, 65px 0 0 -12px #c7c7c7, 66px 0 0 -12px #c7c7c7, 67px 0 0 -12px #c7c7c7, 68px 0 0 -12px #c7c7c7, 69px 0 0 -12px #c7c7c7, 70px 0 0 -12px #c7c7c7, 71px 0 0 -12px #c7c7c7, 72px 0 0 -12px #c7c7c7, 73px 0 0 -12px #c7c7c7, 74px 0 0 -12px #c7c7c7, 75px 0 0 -12px #c7c7c7, 76px 0 0 -12px #c7c7c7, 77px 0 0 -12px #c7c7c7, 78px 0 0 -12px #c7c7c7, 79px 0 0 -12px #c7c7c7, 80px 0 0 -12px #c7c7c7, 81px 0 0 -12px #c7c7c7, 82px 0 0 -12px #c7c7c7, 83px 0 0 -12px #c7c7c7, 84px 0 0 -12px #c7c7c7, 85px 0 0 -12px #c7c7c7, 86px 0 0 -12px #c7c7c7, 87px 0 0 -12px #c7c7c7, 88px 0 0 -12px #c7c7c7, 89px 0 0 -12px #c7c7c7, 90px 0 0 -12px #c7c7c7, 91px 0 0 -12px #c7c7c7, 92px 0 0 -12px #c7c7c7, 93px 0 0 -12px #c7c7c7, 94px 0 0 -12px #c7c7c7, 95px 0 0 -12px #c7c7c7, 96px 0 0 -12px #c7c7c7, 97px 0 0 -12px #c7c7c7, 98px 0 0 -12px #c7c7c7, 99px 0 0 -12px #c7c7c7, 100px 0 0 -12px #c7c7c7, 101px 0 0 -12px #c7c7c7, 102px 0 0 -12px #c7c7c7, 103px 0 0 -12px #c7c7c7, 104px 0 0 -12px #c7c7c7, 105px 0 0 -12px #c7c7c7, 106px 0 0 -12px #c7c7c7, 107px 0 0 -12px #c7c7c7, 108px 0 0 -12px #c7c7c7, 109px 0 0 -12px #c7c7c7, 110px 0 0 -12px #c7c7c7, 111px 0 0 -12px #c7c7c7, 112px 0 0 -12px #c7c7c7, 113px 0 0 -12px #c7c7c7, 114px 0 0 -12px #c7c7c7, 115px 0 0 -12px #c7c7c7, 116px 0 0 -12px #c7c7c7, 117px 0 0 -12px #c7c7c7, 118px 0 0 -12px #c7c7c7, 119px 0 0 -12px #c7c7c7, 120px 0 0 -12px #c7c7c7, 121px 0 0 -12px #c7c7c7, 122px 0 0 -12px #c7c7c7, 123px 0 0 -12px #c7c7c7, 124px 0 0 -12px #c7c7c7, 125px 0 0 -12px #c7c7c7, 126px 0 0 -12px #c7c7c7, 127px 0 0 -12px #c7c7c7, 128px 0 0 -12px #c7c7c7, 129px 0 0 -12px #c7c7c7, 130px 0 0 -12px #c7c7c7, 131px 0 0 -12px #c7c7c7, 132px 0 0 -12px #c7c7c7, 133px 0 0 -12px #c7c7c7, 134px 0 0 -12px #c7c7c7, 135px 0 0 -12px #c7c7c7, 136px 0 0 -12px #c7c7c7, 137px 0 0 -12px #c7c7c7, 138px 0 0 -12px #c7c7c7, 139px 0 0 -12px #c7c7c7, 140px 0 0 -12px #c7c7c7, 141px 0 0 -12px #c7c7c7, 142px 0 0 -12px #c7c7c7, 143px 0 0 -12px #c7c7c7, 144px 0 0 -12px #c7c7c7, 145px 0 0 -12px #c7c7c7, 146px 0 0 -12px #c7c7c7, 147px 0 0 -12px #c7c7c7, 148px 0 0 -12px #c7c7c7, 149px 0 0 -12px #c7c7c7, 150px 0 0 -12px #c7c7c7, 151px 0 0 -12px #c7c7c7, 152px 0 0 -12px #c7c7c7, 153px 0 0 -12px #c7c7c7, 154px 0 0 -12px #c7c7c7, 155px 0 0 -12px #c7c7c7, 156px 0 0 -12px #c7c7c7, 157px 0 0 -12px #c7c7c7, 158px 0 0 -12px #c7c7c7, 159px 0 0 -12px #c7c7c7, 160px 0 0 -12px #c7c7c7, 161px 0 0 -12px #c7c7c7, 162px 0 0 -12px #c7c7c7, 163px 0 0 -12px #c7c7c7, 164px 0 0 -12px #c7c7c7, 165px 0 0 -12px #c7c7c7, 166px 0 0 -12px #c7c7c7, 167px 0 0 -12px #c7c7c7, 168px 0 0 -12px #c7c7c7, 169px 0 0 -12px #c7c7c7, 170px 0 0 -12px #c7c7c7, 171px 0 0 -12px #c7c7c7, 172px 0 0 -12px #c7c7c7, 173px 0 0 -12px #c7c7c7, 174px 0 0 -12px #c7c7c7, 175px 0 0 -12px #c7c7c7, 176px 0 0 -12px #c7c7c7, 177px 0 0 -12px #c7c7c7, 178px 0 0 -12px #c7c7c7, 179px 0 0 -12px #c7c7c7, 180px 0 0 -12px #c7c7c7, 181px 0 0 -12px #c7c7c7, 182px 0 0 -12px #c7c7c7, 183px 0 0 -12px #c7c7c7, 184px 0 0 -12px #c7c7c7, 185px 0 0 -12px #c7c7c7, 186px 0 0 -12px #c7c7c7, 187px 0 0 -12px #c7c7c7, 188px 0 0 -12px #c7c7c7, 189px 0 0 -12px #c7c7c7, 190px 0 0 -12px #c7c7c7, 191px 0 0 -12px #c7c7c7, 192px 0 0 -12px #c7c7c7, 193px 0 0 -12px #c7c7c7, 194px 0 0 -12px #c7c7c7, 195px 0 0 -12px #c7c7c7, 196px 0 0 -12px #c7c7c7, 197px 0 0 -12px #c7c7c7, 198px 0 0 -12px #c7c7c7, 199px 0 0 -12px #c7c7c7, 200px 0 0 -12px #c7c7c7, 201px 0 0 -12px #c7c7c7, 202px 0 0 -12px #c7c7c7, 203px 0 0 -12px #c7c7c7, 204px 0 0 -12px #c7c7c7, 205px 0 0 -12px #c7c7c7, 206px 0 0 -12px #c7c7c7, 207px 0 0 -12px #c7c7c7, 208px 0 0 -12px #c7c7c7, 209px 0 0 -12px #c7c7c7, 210px 0 0 -12px #c7c7c7, 211px 0 0 -12px #c7c7c7, 212px 0 0 -12px #c7c7c7, 213px 0 0 -12px #c7c7c7, 214px 0 0 -12px #c7c7c7, 215px 0 0 -12px #c7c7c7, 216px 0 0 -12px #c7c7c7, 217px 0 0 -12px #c7c7c7, 218px 0 0 -12px #c7c7c7, 219px 0 0 -12px #c7c7c7, 220px 0 0 -12px #c7c7c7, 221px 0 0 -12px #c7c7c7, 222px 0 0 -12px #c7c7c7, 223px 0 0 -12px #c7c7c7, 224px 0 0 -12px #c7c7c7, 225px 0 0 -12px #c7c7c7, 226px 0 0 -12px #c7c7c7, 227px 0 0 -12px #c7c7c7, 228px 0 0 -12px #c7c7c7, 229px 0 0 -12px #c7c7c7, 230px 0 0 -12px #c7c7c7, 231px 0 0 -12px #c7c7c7, 232px 0 0 -12px #c7c7c7, 233px 0 0 -12px #c7c7c7, 234px 0 0 -12px #c7c7c7, 235px 0 0 -12px #c7c7c7, 236px 0 0 -12px #c7c7c7, 237px 0 0 -12px #c7c7c7, 238px 0 0 -12px #c7c7c7, 239px 0 0 -12px #c7c7c7, 240px 0 0 -12px #c7c7c7, 241px 0 0 -12px #c7c7c7, 242px 0 0 -12px #c7c7c7, 243px 0 0 -12px #c7c7c7, 244px 0 0 -12px #c7c7c7, 245px 0 0 -12px #c7c7c7, 246px 0 0 -12px #c7c7c7, 247px 0 0 -12px #c7c7c7, 248px 0 0 -12px #c7c7c7, 249px 0 0 -12px #c7c7c7, 250px 0 0 -12px #c7c7c7, 251px 0 0 -12px #c7c7c7, 252px 0 0 -12px #c7c7c7, 253px 0 0 -12px #c7c7c7, 254px 0 0 -12px #c7c7c7, 255px 0 0 -12px #c7c7c7, 256px 0 0 -12px #c7c7c7, 257px 0 0 -12px #c7c7c7, 258px 0 0 -12px #c7c7c7, 259px 0 0 -12px #c7c7c7, 260px 0 0 -12px #c7c7c7, 261px 0 0 -12px #c7c7c7, 262px 0 0 -12px #c7c7c7, 263px 0 0 -12px #c7c7c7, 264px 0 0 -12px #c7c7c7, 265px 0 0 -12px #c7c7c7, 266px 0 0 -12px #c7c7c7, 267px 0 0 -12px #c7c7c7, 268px 0 0 -12px #c7c7c7, 269px 0 0 -12px #c7c7c7, 270px 0 0 -12px #c7c7c7, 271px 0 0 -12px #c7c7c7, 272px 0 0 -12px #c7c7c7, 273px 0 0 -12px #c7c7c7, 274px 0 0 -12px #c7c7c7, 275px 0 0 -12px #c7c7c7, 276px 0 0 -12px #c7c7c7, 277px 0 0 -12px #c7c7c7, 278px 0 0 -12px #c7c7c7, 279px 0 0 -12px #c7c7c7, 280px 0 0 -12px #c7c7c7, 281px 0 0 -12px #c7c7c7, 282px 0 0 -12px #c7c7c7, 283px 0 0 -12px #c7c7c7, 284px 0 0 -12px #c7c7c7, 285px 0 0 -12px #c7c7c7, 286px 0 0 -12px #c7c7c7, 287px 0 0 -12px #c7c7c7, 288px 0 0 -12px #c7c7c7, 289px 0 0 -12px #c7c7c7, 290px 0 0 -12px #c7c7c7, 291px 0 0 -12px #c7c7c7, 292px 0 0 -12px #c7c7c7, 293px 0 0 -12px #c7c7c7, 294px 0 0 -12px #c7c7c7, 295px 0 0 -12px #c7c7c7, 296px 0 0 -12px #c7c7c7, 297px 0 0 -12px #c7c7c7, 298px 0 0 -12px #c7c7c7, 299px 0 0 -12px #c7c7c7, 300px 0 0 -12px #c7c7c7, 301px 0 0 -12px #c7c7c7, 302px 0 0 -12px #c7c7c7, 303px 0 0 -12px #c7c7c7, 304px 0 0 -12px #c7c7c7, 305px 0 0 -12px #c7c7c7, 306px 0 0 -12px #c7c7c7, 307px 0 0 -12px #c7c7c7, 308px 0 0 -12px #c7c7c7, 309px 0 0 -12px #c7c7c7, 310px 0 0 -12px #c7c7c7, 311px 0 0 -12px #c7c7c7, 312px 0 0 -12px #c7c7c7, 313px 0 0 -12px #c7c7c7, 314px 0 0 -12px #c7c7c7, 315px 0 0 -12px #c7c7c7, 316px 0 0 -12px #c7c7c7, 317px 0 0 -12px #c7c7c7, 318px 0 0 -12px #c7c7c7, 319px 0 0 -12px #c7c7c7, 320px 0 0 -12px #c7c7c7, 321px 0 0 -12px #c7c7c7, 322px 0 0 -12px #c7c7c7, 323px 0 0 -12px #c7c7c7, 324px 0 0 -12px #c7c7c7, 325px 0 0 -12px #c7c7c7, 326px 0 0 -12px #c7c7c7, 327px 0 0 -12px #c7c7c7, 328px 0 0 -12px #c7c7c7, 329px 0 0 -12px #c7c7c7, 330px 0 0 -12px #c7c7c7, 331px 0 0 -12px #c7c7c7, 332px 0 0 -12px #c7c7c7, 333px 0 0 -12px #c7c7c7, 334px 0 0 -12px #c7c7c7, 335px 0 0 -12px #c7c7c7, 336px 0 0 -12px #c7c7c7, 337px 0 0 -12px #c7c7c7, 338px 0 0 -12px #c7c7c7, 339px 0 0 -12px #c7c7c7, 340px 0 0 -12px #c7c7c7, 341px 0 0 -12px #c7c7c7, 342px 0 0 -12px #c7c7c7, 343px 0 0 -12px #c7c7c7, 344px 0 0 -12px #c7c7c7, 345px 0 0 -12px #c7c7c7, 346px 0 0 -12px #c7c7c7, 347px 0 0 -12px #c7c7c7, 348px 0 0 -12px #c7c7c7, 349px 0 0 -12px #c7c7c7, 350px 0 0 -12px #c7c7c7, 0px 0 0 -10px #c7c7c7;\n}\n#user {\n  margin-top: 50px;\n}\n.user-card {\n  width: 640px;\n  height: 200px;\n  padding: 0 30px;\n  border: 3px solid #D9E3F0;\n  border-radius: 10px;\n  display: flex;\n}\n.user-card .thumb {\n  height: 140px;\n  margin: 30px 0;\n}\n.user-card .thumb img {\n  height: 120px;\n  width: 120px;\n  border: 2px solid #D9E3F0;\n  border-radius: 50%;\n  padding: 10px;\n  transition: transform 0.5s ease-in-out;\n}\n.user-card .thumb img:hover {\n  transform: rotate(360deg);\n}\n.user-card .info {\n  flex-grow: 7;\n  margin: 50px 20px;\n}\n.user-card .info p {\n  margin: 10px;\n}\n.user-card .info .title {\n  font-size: 30px;\n  font-weight: 900;\n  color: #697689;\n}\n.user-card .info .subtitle {\n  font-size: 26px;\n  color: #697689;\n}\n.user-card .action {\n  text-align: right;\n  margin: 60px 20px;\n  height: 80px;\n  width: 80px;\n  background-repeat: no-repeat;\n  background-size: 100% 100%;\n  background-image: url(" + escape(__webpack_require__(/*! ../images/add.png */ "./src/images/add.png")) + ");\n}\n.user-card .action:hover {\n  cursor: pointer;\n  background-image: url(" + escape(__webpack_require__(/*! ../images/add-hover.png */ "./src/images/add-hover.png")) + ");\n}\n#video-box {\n  margin-left: 50px;\n}\n.video {\n  width: 560px;\n  height: 300px;\n  position: relative;\n  margin-left: 50px;\n  border: 3px solid #D9E3F0;\n  border-radius: 10px;\n}\n.video .video-video {\n  object-fit: fill;\n  width: 530px;\n  height: 350ox;\n}\n.video .control {\n  height: 110px;\n  width: 100%;\n  background: #D9E3F0;\n  position: absolute;\n  bottom: 0;\n  display: flex;\n}\n.video .control .control__start {\n  margin: 25px 20px;\n  height: 60px;\n  width: 60px;\n  background-repeat: no-repeat;\n  background: url(" + escape(__webpack_require__(/*! ../images/start.png */ "./src/images/start.png")) + ");\n  background-size: 100% 100%;\n}\n.video .control .ranger {\n  background: none;\n}\n#table {\n  margin-top: 50px;\n}\n.lineTable {\n  border: 3px solid #D9E3F0;\n  border-radius: 10px;\n  padding: 10px 30px;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/css-loader/lib/url/escape.js":
/*!***************************************************!*\
  !*** ./node_modules/css-loader/lib/url/escape.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./src/images/add-hover.png":
/*!**********************************!*\
  !*** ./src/images/add-hover.png ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ "./src/images/add.png":
/*!****************************!*\
  !*** ./src/images/add.png ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ "./src/images/start.png":
/*!******************************!*\
  !*** ./src/images/start.png ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "data:image/png;base64,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"

/***/ }),

/***/ "./src/js/index.js":
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(/*! ../stylesheet/main.less */ "./src/stylesheet/main.less");

function lineTable(canvas, data, options) {
  var cxt = canvas.getContext("2d");

  // 数据预处理

  console.log(data);

  // data.sort(function(a, b){
  //   return a.x -b.x;
  // })

  // 不同屏幕放大处理
  (function () {
    // 屏幕的设备像素比
    var devicePixelRatio = window.devicePixelRatio || 1;

    // 浏览器在渲染canvas之前存储画布信息的像素比
    var backingStoreRatio = cxt.webkitBackingStorePixelRatio || cxt.mozBackingStorePixelRatio || cxt.msBackingStorePixelRatio || cxt.oBackingStorePixelRatio || cxt.backingStorePixelRatio || 1;

    // canvas的实际渲染倍率
    var ratio = devicePixelRatio / backingStoreRatio;

    canvas.style.width = canvas.width * ratio;
    canvas.style.height = canvas.height * ratio;

    // canvas.width = canvas.width * ratio;
    // canvas.height = canvas.height * ratio;
  })();

  // 绘画曲线
  this.paintLine = function () {
    cxt.beginPath();
    cxt.strokeStyle = "#2CCCE4";
    cxt.lineWidth = 5;
    cxt.moveTo(data[0].x, data[0].y);
    cxt.lineJoin = "round";

    for (var i = 1; i < data.length; i++) {
      cxt.lineTo(data[i].x, data[i].y);
    }

    cxt.stroke();
  };

  // 绘画坐标点
  this.paintPoint = function () {
    data.forEach(function (item) {
      cxt.fillStyle = "#2CCCE4";
      cxt.beginPath();
      cxt.arc(item.x, item.y, 15, 0, Math.PI * 2, true);
      cxt.closePath();
      cxt.fill();

      cxt.fillStyle = "#FFFFFF";
      cxt.beginPath();
      cxt.arc(item.x, item.y, 10, 0, Math.PI * 2, true);
      cxt.closePath();
      cxt.fill();
    });
  };

  this.paintLine();
  this.paintPoint();
}

var canvas = document.getElementById("myLineTable");
new lineTable(canvas, [{ x: 20, y: 230 }, { x: 200, y: 40 }, { x: 400, y: 160 }, { x: 600, y: 30 }], {
  width: 640, height: 280
});

/***/ }),

/***/ "./src/stylesheet/main.less":
/*!**********************************!*\
  !*** ./src/stylesheet/main.less ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/css-loader!../../node_modules/less-loader/dist/cjs.js!./main.less */ "./node_modules/css-loader/index.js!./node_modules/less-loader/dist/cjs.js!./src/stylesheet/main.less");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../../node_modules/css-loader!../../node_modules/less-loader/dist/cjs.js!./main.less */ "./node_modules/css-loader/index.js!./node_modules/less-loader/dist/cjs.js!./src/stylesheet/main.less", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { (function() {
		var newContent = __webpack_require__(/*! !../../node_modules/css-loader!../../node_modules/less-loader/dist/cjs.js!./main.less */ "./node_modules/css-loader/index.js!./node_modules/less-loader/dist/cjs.js!./src/stylesheet/main.less");

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	})(__WEBPACK_OUTDATED_DEPENDENCIES__); });

	module.hot.dispose(function() { update(); });
}

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0eWxlc2hlZXQvbWFpbi5sZXNzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvdXJsL2VzY2FwZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2xpYi9hZGRTdHlsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvdXJscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW1hZ2VzL2FkZC1ob3Zlci5wbmciLCJ3ZWJwYWNrOi8vLy4vc3JjL2ltYWdlcy9hZGQucG5nIiwid2VicGFjazovLy8uL3NyYy9pbWFnZXMvc3RhcnQucG5nIiwid2VicGFjazovLy8uL3NyYy9qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzaGVldC9tYWluLmxlc3M/ZTU1OSJdLCJuYW1lcyI6WyJsaW5lVGFibGUiLCJjYW52YXMiLCJkYXRhIiwib3B0aW9ucyIsImN4dCIsImdldENvbnRleHQiLCJjb25zb2xlIiwibG9nIiwiZGV2aWNlUGl4ZWxSYXRpbyIsIndpbmRvdyIsImJhY2tpbmdTdG9yZVJhdGlvIiwid2Via2l0QmFja2luZ1N0b3JlUGl4ZWxSYXRpbyIsIm1vekJhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJtc0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJvQmFja2luZ1N0b3JlUGl4ZWxSYXRpbyIsImJhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJyYXRpbyIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJwYWludExpbmUiLCJiZWdpblBhdGgiLCJzdHJva2VTdHlsZSIsImxpbmVXaWR0aCIsIm1vdmVUbyIsIngiLCJ5IiwibGluZUpvaW4iLCJpIiwibGVuZ3RoIiwibGluZVRvIiwic3Ryb2tlIiwicGFpbnRQb2ludCIsImZvckVhY2giLCJmaWxsU3R5bGUiLCJhcmMiLCJpdGVtIiwiTWF0aCIsIlBJIiwiY2xvc2VQYXRoIiwiZmlsbCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0EsY0FBTTtBQUNOO0FBQ0E7QUFDQSxjQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsZUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUk7QUFDSjs7QUFFQTtBQUNBLHNEQUE4QztBQUM5QztBQUNBO0FBQ0Esb0NBQTRCO0FBQzVCLHFDQUE2QjtBQUM3Qix5Q0FBaUM7O0FBRWpDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FB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O0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEOztBQUVBLDZCQUE2QixtQkFBbUI7O0FBRWhEOztBQUVBOztBQUVBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUMxWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLFdB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U0MsY0FBVCxDQUF3QixhQUF4QixDQUFiO0FBQ0EsSUFBSTFDLFNBQUosQ0FBY0MsTUFBZCxFQUFzQixDQUNwQixFQUFDd0IsR0FBRyxFQUFKLEVBQVFDLEdBQUUsR0FBVixFQURvQixFQUVwQixFQUFDRCxHQUFHLEdBQUosRUFBU0MsR0FBRSxFQUFYLEVBRm9CLEVBR3BCLEVBQUNELEdBQUcsR0FBSixFQUFTQyxHQUFFLEdBQVgsRUFIb0IsRUFJcEIsRUFBQ0QsR0FBRyxHQUFKLEVBQVNDLEdBQUUsRUFBWCxFQUpvQixDQUF0QixFQUtFO0FBQ0FSLFNBQU8sR0FEUCxFQUNZQyxRQUFPO0FBRG5CLENBTEYsRTs7Ozs7Ozs7Ozs7O0FDeEVBOztBQUVBOztBQUVBO0FBQ0E7Ozs7QUFJQSxlQUFlOztBQUVmO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxHQUFHOztBQUVIOztBQUVBO0FBQ0EsRUFBRTs7QUFFRixnQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0ZnVuY3Rpb24gaG90RGlzcG9zZUNodW5rKGNodW5rSWQpIHtcbiBcdFx0ZGVsZXRlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXTtcbiBcdH1cbiBcdHZhciBwYXJlbnRIb3RVcGRhdGVDYWxsYmFjayA9IHdpbmRvd1tcIndlYnBhY2tIb3RVcGRhdGVcIl07XG4gXHR3aW5kb3dbXCJ3ZWJwYWNrSG90VXBkYXRlXCJdID0gLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSG90VXBkYXRlQ2FsbGJhY2soY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHtcbiBcdFx0aG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpO1xuIFx0XHRpZiAocGFyZW50SG90VXBkYXRlQ2FsbGJhY2spIHBhcmVudEhvdFVwZGF0ZUNhbGxiYWNrKGNodW5rSWQsIG1vcmVNb2R1bGVzKTtcbiBcdH0gO1xuXG4gXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdGZ1bmN0aW9uIGhvdERvd25sb2FkVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXTtcbiBcdFx0dmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gXHRcdHNjcmlwdC5jaGFyc2V0ID0gXCJ1dGYtOFwiO1xuIFx0XHRzY3JpcHQuc3JjID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGNodW5rSWQgKyBcIi5cIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc1wiO1xuIFx0XHQ7XG4gXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3REb3dubG9hZE1hbmlmZXN0KHJlcXVlc3RUaW1lb3V0KSB7XG4gXHRcdHJlcXVlc3RUaW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQgfHwgMTAwMDA7XG4gXHRcdHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiBcdFx0XHRpZiAodHlwZW9mIFhNTEh0dHBSZXF1ZXN0ID09PSBcInVuZGVmaW5lZFwiKVxuIFx0XHRcdFx0cmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJObyBicm93c2VyIHN1cHBvcnRcIikpO1xuIFx0XHRcdHRyeSB7XG4gXHRcdFx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuIFx0XHRcdFx0dmFyIHJlcXVlc3RQYXRoID0gX193ZWJwYWNrX3JlcXVpcmVfXy5wICsgXCJcIiArIGhvdEN1cnJlbnRIYXNoICsgXCIuaG90LXVwZGF0ZS5qc29uXCI7XG4gXHRcdFx0XHRyZXF1ZXN0Lm9wZW4oXCJHRVRcIiwgcmVxdWVzdFBhdGgsIHRydWUpO1xuIFx0XHRcdFx0cmVxdWVzdC50aW1lb3V0ID0gcmVxdWVzdFRpbWVvdXQ7XG4gXHRcdFx0XHRyZXF1ZXN0LnNlbmQobnVsbCk7XG4gXHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycik7XG4gXHRcdFx0fVxuIFx0XHRcdHJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRpZiAocmVxdWVzdC5yZWFkeVN0YXRlICE9PSA0KSByZXR1cm47XG4gXHRcdFx0XHRpZiAocmVxdWVzdC5zdGF0dXMgPT09IDApIHtcbiBcdFx0XHRcdFx0Ly8gdGltZW91dFxuIFx0XHRcdFx0XHRyZWplY3QoXG4gXHRcdFx0XHRcdFx0bmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgdGltZWQgb3V0LlwiKVxuIFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LnN0YXR1cyA9PT0gNDA0KSB7XG4gXHRcdFx0XHRcdC8vIG5vIHVwZGF0ZSBhdmFpbGFibGVcbiBcdFx0XHRcdFx0cmVzb2x2ZSgpO1xuIFx0XHRcdFx0fSBlbHNlIGlmIChyZXF1ZXN0LnN0YXR1cyAhPT0gMjAwICYmIHJlcXVlc3Quc3RhdHVzICE9PSAzMDQpIHtcbiBcdFx0XHRcdFx0Ly8gb3RoZXIgZmFpbHVyZVxuIFx0XHRcdFx0XHRyZWplY3QobmV3IEVycm9yKFwiTWFuaWZlc3QgcmVxdWVzdCB0byBcIiArIHJlcXVlc3RQYXRoICsgXCIgZmFpbGVkLlwiKSk7XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHQvLyBzdWNjZXNzXG4gXHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0dmFyIHVwZGF0ZSA9IEpTT04ucGFyc2UocmVxdWVzdC5yZXNwb25zZVRleHQpO1xuIFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7XG4gXHRcdFx0XHRcdFx0cmVqZWN0KGUpO1xuIFx0XHRcdFx0XHRcdHJldHVybjtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRyZXNvbHZlKHVwZGF0ZSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdHZhciBob3RBcHBseU9uVXBkYXRlID0gdHJ1ZTtcbiBcdHZhciBob3RDdXJyZW50SGFzaCA9IFwiMGZiNjAwNTc4ZTEyMDBjM2NiNjRcIjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0dmFyIGhvdFJlcXVlc3RUaW1lb3V0ID0gMTAwMDA7XG4gXHR2YXIgaG90Q3VycmVudE1vZHVsZURhdGEgPSB7fTtcbiBcdHZhciBob3RDdXJyZW50Q2hpbGRNb2R1bGU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiBcdHZhciBob3RDdXJyZW50UGFyZW50cyA9IFtdOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gXHR2YXIgaG90Q3VycmVudFBhcmVudHNUZW1wID0gW107IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVSZXF1aXJlKG1vZHVsZUlkKSB7XG4gXHRcdHZhciBtZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRpZiAoIW1lKSByZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXztcbiBcdFx0dmFyIGZuID0gZnVuY3Rpb24ocmVxdWVzdCkge1xuIFx0XHRcdGlmIChtZS5ob3QuYWN0aXZlKSB7XG4gXHRcdFx0XHRpZiAoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XSkge1xuIFx0XHRcdFx0XHRpZiAoaW5zdGFsbGVkTW9kdWxlc1tyZXF1ZXN0XS5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpID09PSAtMSlcbiBcdFx0XHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW3JlcXVlc3RdLnBhcmVudHMucHVzaChtb2R1bGVJZCk7XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHJlcXVlc3Q7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAobWUuY2hpbGRyZW4uaW5kZXhPZihyZXF1ZXN0KSA9PT0gLTEpIG1lLmNoaWxkcmVuLnB1c2gocmVxdWVzdCk7XG4gXHRcdFx0fSBlbHNlIHtcbiBcdFx0XHRcdGNvbnNvbGUud2FybihcbiBcdFx0XHRcdFx0XCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgK1xuIFx0XHRcdFx0XHRcdHJlcXVlc3QgK1xuIFx0XHRcdFx0XHRcdFwiKSBmcm9tIGRpc3Bvc2VkIG1vZHVsZSBcIiArXG4gXHRcdFx0XHRcdFx0bW9kdWxlSWRcbiBcdFx0XHRcdCk7XG4gXHRcdFx0XHRob3RDdXJyZW50UGFyZW50cyA9IFtdO1xuIFx0XHRcdH1cbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhyZXF1ZXN0KTtcbiBcdFx0fTtcbiBcdFx0dmFyIE9iamVjdEZhY3RvcnkgPSBmdW5jdGlvbiBPYmplY3RGYWN0b3J5KG5hbWUpIHtcbiBcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZnVuY3Rpb24oKSB7XG4gXHRcdFx0XHRcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fW25hbWVdO1xuIFx0XHRcdFx0fSxcbiBcdFx0XHRcdHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiBcdFx0XHRcdFx0X193ZWJwYWNrX3JlcXVpcmVfX1tuYW1lXSA9IHZhbHVlO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH07XG4gXHRcdH07XG4gXHRcdGZvciAodmFyIG5hbWUgaW4gX193ZWJwYWNrX3JlcXVpcmVfXykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChfX3dlYnBhY2tfcmVxdWlyZV9fLCBuYW1lKSAmJlxuIFx0XHRcdFx0bmFtZSAhPT0gXCJlXCJcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbiwgbmFtZSwgT2JqZWN0RmFjdG9yeShuYW1lKSk7XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGZuLmUgPSBmdW5jdGlvbihjaHVua0lkKSB7XG4gXHRcdFx0aWYgKGhvdFN0YXR1cyA9PT0gXCJyZWFkeVwiKSBob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xuIFx0XHRcdGhvdENodW5rc0xvYWRpbmcrKztcbiBcdFx0XHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5lKGNodW5rSWQpLnRoZW4oZmluaXNoQ2h1bmtMb2FkaW5nLCBmdW5jdGlvbihlcnIpIHtcbiBcdFx0XHRcdGZpbmlzaENodW5rTG9hZGluZygpO1xuIFx0XHRcdFx0dGhyb3cgZXJyO1xuIFx0XHRcdH0pO1xuXG4gXHRcdFx0ZnVuY3Rpb24gZmluaXNoQ2h1bmtMb2FkaW5nKCkge1xuIFx0XHRcdFx0aG90Q2h1bmtzTG9hZGluZy0tO1xuIFx0XHRcdFx0aWYgKGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIpIHtcbiBcdFx0XHRcdFx0aWYgKCFob3RXYWl0aW5nRmlsZXNNYXBbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdFx0XHRob3RFbnN1cmVVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRpZiAoaG90Q2h1bmtzTG9hZGluZyA9PT0gMCAmJiBob3RXYWl0aW5nRmlsZXMgPT09IDApIHtcbiBcdFx0XHRcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH07XG4gXHRcdHJldHVybiBmbjtcbiBcdH1cblxuIFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gXHRmdW5jdGlvbiBob3RDcmVhdGVNb2R1bGUobW9kdWxlSWQpIHtcbiBcdFx0dmFyIGhvdCA9IHtcbiBcdFx0XHQvLyBwcml2YXRlIHN0dWZmXG4gXHRcdFx0X2FjY2VwdGVkRGVwZW5kZW5jaWVzOiB7fSxcbiBcdFx0XHRfZGVjbGluZWREZXBlbmRlbmNpZXM6IHt9LFxuIFx0XHRcdF9zZWxmQWNjZXB0ZWQ6IGZhbHNlLFxuIFx0XHRcdF9zZWxmRGVjbGluZWQ6IGZhbHNlLFxuIFx0XHRcdF9kaXNwb3NlSGFuZGxlcnM6IFtdLFxuIFx0XHRcdF9tYWluOiBob3RDdXJyZW50Q2hpbGRNb2R1bGUgIT09IG1vZHVsZUlkLFxuXG4gXHRcdFx0Ly8gTW9kdWxlIEFQSVxuIFx0XHRcdGFjdGl2ZTogdHJ1ZSxcbiBcdFx0XHRhY2NlcHQ6IGZ1bmN0aW9uKGRlcCwgY2FsbGJhY2spIHtcbiBcdFx0XHRcdGlmICh0eXBlb2YgZGVwID09PSBcInVuZGVmaW5lZFwiKSBob3QuX3NlbGZBY2NlcHRlZCA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGlmICh0eXBlb2YgZGVwID09PSBcImZ1bmN0aW9uXCIpIGhvdC5fc2VsZkFjY2VwdGVkID0gZGVwO1xuIFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGRlcCA9PT0gXCJvYmplY3RcIilcbiBcdFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZXAubGVuZ3RoOyBpKyspXG4gXHRcdFx0XHRcdFx0aG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBbaV1dID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcbiBcdFx0XHRcdGVsc2UgaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBdID0gY2FsbGJhY2sgfHwgZnVuY3Rpb24oKSB7fTtcbiBcdFx0XHR9LFxuIFx0XHRcdGRlY2xpbmU6IGZ1bmN0aW9uKGRlcCkge1xuIFx0XHRcdFx0aWYgKHR5cGVvZiBkZXAgPT09IFwidW5kZWZpbmVkXCIpIGhvdC5fc2VsZkRlY2xpbmVkID0gdHJ1ZTtcbiBcdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiBkZXAgPT09IFwib2JqZWN0XCIpXG4gXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgZGVwLmxlbmd0aDsgaSsrKVxuIFx0XHRcdFx0XHRcdGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwW2ldXSA9IHRydWU7XG4gXHRcdFx0XHRlbHNlIGhvdC5fZGVjbGluZWREZXBlbmRlbmNpZXNbZGVwXSA9IHRydWU7XG4gXHRcdFx0fSxcbiBcdFx0XHRkaXNwb3NlOiBmdW5jdGlvbihjYWxsYmFjaykge1xuIFx0XHRcdFx0aG90Ll9kaXNwb3NlSGFuZGxlcnMucHVzaChjYWxsYmFjayk7XG4gXHRcdFx0fSxcbiBcdFx0XHRhZGREaXNwb3NlSGFuZGxlcjogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiBcdFx0XHRcdGhvdC5fZGlzcG9zZUhhbmRsZXJzLnB1c2goY2FsbGJhY2spO1xuIFx0XHRcdH0sXG4gXHRcdFx0cmVtb3ZlRGlzcG9zZUhhbmRsZXI6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gXHRcdFx0XHR2YXIgaWR4ID0gaG90Ll9kaXNwb3NlSGFuZGxlcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gXHRcdFx0XHRpZiAoaWR4ID49IDApIGhvdC5fZGlzcG9zZUhhbmRsZXJzLnNwbGljZShpZHgsIDEpO1xuIFx0XHRcdH0sXG5cbiBcdFx0XHQvLyBNYW5hZ2VtZW50IEFQSVxuIFx0XHRcdGNoZWNrOiBob3RDaGVjayxcbiBcdFx0XHRhcHBseTogaG90QXBwbHksXG4gXHRcdFx0c3RhdHVzOiBmdW5jdGlvbihsKSB7XG4gXHRcdFx0XHRpZiAoIWwpIHJldHVybiBob3RTdGF0dXM7XG4gXHRcdFx0XHRob3RTdGF0dXNIYW5kbGVycy5wdXNoKGwpO1xuIFx0XHRcdH0sXG4gXHRcdFx0YWRkU3RhdHVzSGFuZGxlcjogZnVuY3Rpb24obCkge1xuIFx0XHRcdFx0aG90U3RhdHVzSGFuZGxlcnMucHVzaChsKTtcbiBcdFx0XHR9LFxuIFx0XHRcdHJlbW92ZVN0YXR1c0hhbmRsZXI6IGZ1bmN0aW9uKGwpIHtcbiBcdFx0XHRcdHZhciBpZHggPSBob3RTdGF0dXNIYW5kbGVycy5pbmRleE9mKGwpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSBob3RTdGF0dXNIYW5kbGVycy5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHR9LFxuXG4gXHRcdFx0Ly9pbmhlcml0IGZyb20gcHJldmlvdXMgZGlzcG9zZSBjYWxsXG4gXHRcdFx0ZGF0YTogaG90Q3VycmVudE1vZHVsZURhdGFbbW9kdWxlSWRdXG4gXHRcdH07XG4gXHRcdGhvdEN1cnJlbnRDaGlsZE1vZHVsZSA9IHVuZGVmaW5lZDtcbiBcdFx0cmV0dXJuIGhvdDtcbiBcdH1cblxuIFx0dmFyIGhvdFN0YXR1c0hhbmRsZXJzID0gW107XG4gXHR2YXIgaG90U3RhdHVzID0gXCJpZGxlXCI7XG5cbiBcdGZ1bmN0aW9uIGhvdFNldFN0YXR1cyhuZXdTdGF0dXMpIHtcbiBcdFx0aG90U3RhdHVzID0gbmV3U3RhdHVzO1xuIFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGhvdFN0YXR1c0hhbmRsZXJzLmxlbmd0aDsgaSsrKVxuIFx0XHRcdGhvdFN0YXR1c0hhbmRsZXJzW2ldLmNhbGwobnVsbCwgbmV3U3RhdHVzKTtcbiBcdH1cblxuIFx0Ly8gd2hpbGUgZG93bmxvYWRpbmdcbiBcdHZhciBob3RXYWl0aW5nRmlsZXMgPSAwO1xuIFx0dmFyIGhvdENodW5rc0xvYWRpbmcgPSAwO1xuIFx0dmFyIGhvdFdhaXRpbmdGaWxlc01hcCA9IHt9O1xuIFx0dmFyIGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XG4gXHR2YXIgaG90QXZhaWxhYmxlRmlsZXNNYXAgPSB7fTtcbiBcdHZhciBob3REZWZlcnJlZDtcblxuIFx0Ly8gVGhlIHVwZGF0ZSBpbmZvXG4gXHR2YXIgaG90VXBkYXRlLCBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRmdW5jdGlvbiB0b01vZHVsZUlkKGlkKSB7XG4gXHRcdHZhciBpc051bWJlciA9ICtpZCArIFwiXCIgPT09IGlkO1xuIFx0XHRyZXR1cm4gaXNOdW1iZXIgPyAraWQgOiBpZDtcbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90Q2hlY2soYXBwbHkpIHtcbiBcdFx0aWYgKGhvdFN0YXR1cyAhPT0gXCJpZGxlXCIpXG4gXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiY2hlY2soKSBpcyBvbmx5IGFsbG93ZWQgaW4gaWRsZSBzdGF0dXNcIik7XG4gXHRcdGhvdEFwcGx5T25VcGRhdGUgPSBhcHBseTtcbiBcdFx0aG90U2V0U3RhdHVzKFwiY2hlY2tcIik7XG4gXHRcdHJldHVybiBob3REb3dubG9hZE1hbmlmZXN0KGhvdFJlcXVlc3RUaW1lb3V0KS50aGVuKGZ1bmN0aW9uKHVwZGF0ZSkge1xuIFx0XHRcdGlmICghdXBkYXRlKSB7XG4gXHRcdFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xuIFx0XHRcdFx0cmV0dXJuIG51bGw7XG4gXHRcdFx0fVxuIFx0XHRcdGhvdFJlcXVlc3RlZEZpbGVzTWFwID0ge307XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwID0ge307XG4gXHRcdFx0aG90QXZhaWxhYmxlRmlsZXNNYXAgPSB1cGRhdGUuYztcbiBcdFx0XHRob3RVcGRhdGVOZXdIYXNoID0gdXBkYXRlLmg7XG5cbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJwcmVwYXJlXCIpO1xuIFx0XHRcdHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gXHRcdFx0XHRob3REZWZlcnJlZCA9IHtcbiBcdFx0XHRcdFx0cmVzb2x2ZTogcmVzb2x2ZSxcbiBcdFx0XHRcdFx0cmVqZWN0OiByZWplY3RcbiBcdFx0XHRcdH07XG4gXHRcdFx0fSk7XG4gXHRcdFx0aG90VXBkYXRlID0ge307XG4gXHRcdFx0dmFyIGNodW5rSWQgPSBcIm1haW5cIjtcbiBcdFx0XHR7XG4gXHRcdFx0XHQvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvbmUtYmxvY2tzXG4gXHRcdFx0XHQvKmdsb2JhbHMgY2h1bmtJZCAqL1xuIFx0XHRcdFx0aG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0fVxuIFx0XHRcdGlmIChcbiBcdFx0XHRcdGhvdFN0YXR1cyA9PT0gXCJwcmVwYXJlXCIgJiZcbiBcdFx0XHRcdGhvdENodW5rc0xvYWRpbmcgPT09IDAgJiZcbiBcdFx0XHRcdGhvdFdhaXRpbmdGaWxlcyA9PT0gMFxuIFx0XHRcdCkge1xuIFx0XHRcdFx0aG90VXBkYXRlRG93bmxvYWRlZCgpO1xuIFx0XHRcdH1cbiBcdFx0XHRyZXR1cm4gcHJvbWlzZTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuIFx0ZnVuY3Rpb24gaG90QWRkVXBkYXRlQ2h1bmsoY2h1bmtJZCwgbW9yZU1vZHVsZXMpIHtcbiBcdFx0aWYgKCFob3RBdmFpbGFibGVGaWxlc01hcFtjaHVua0lkXSB8fCAhaG90UmVxdWVzdGVkRmlsZXNNYXBbY2h1bmtJZF0pXG4gXHRcdFx0cmV0dXJuO1xuIFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IGZhbHNlO1xuIFx0XHRmb3IgKHZhciBtb2R1bGVJZCBpbiBtb3JlTW9kdWxlcykge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0aG90VXBkYXRlW21vZHVsZUlkXSA9IG1vcmVNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cbiBcdFx0aWYgKC0taG90V2FpdGluZ0ZpbGVzID09PSAwICYmIGhvdENodW5rc0xvYWRpbmcgPT09IDApIHtcbiBcdFx0XHRob3RVcGRhdGVEb3dubG9hZGVkKCk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90RW5zdXJlVXBkYXRlQ2h1bmsoY2h1bmtJZCkge1xuIFx0XHRpZiAoIWhvdEF2YWlsYWJsZUZpbGVzTWFwW2NodW5rSWRdKSB7XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzTWFwW2NodW5rSWRdID0gdHJ1ZTtcbiBcdFx0fSBlbHNlIHtcbiBcdFx0XHRob3RSZXF1ZXN0ZWRGaWxlc01hcFtjaHVua0lkXSA9IHRydWU7XG4gXHRcdFx0aG90V2FpdGluZ0ZpbGVzKys7XG4gXHRcdFx0aG90RG93bmxvYWRVcGRhdGVDaHVuayhjaHVua0lkKTtcbiBcdFx0fVxuIFx0fVxuXG4gXHRmdW5jdGlvbiBob3RVcGRhdGVEb3dubG9hZGVkKCkge1xuIFx0XHRob3RTZXRTdGF0dXMoXCJyZWFkeVwiKTtcbiBcdFx0dmFyIGRlZmVycmVkID0gaG90RGVmZXJyZWQ7XG4gXHRcdGhvdERlZmVycmVkID0gbnVsbDtcbiBcdFx0aWYgKCFkZWZlcnJlZCkgcmV0dXJuO1xuIFx0XHRpZiAoaG90QXBwbHlPblVwZGF0ZSkge1xuIFx0XHRcdC8vIFdyYXAgZGVmZXJyZWQgb2JqZWN0IGluIFByb21pc2UgdG8gbWFyayBpdCBhcyBhIHdlbGwtaGFuZGxlZCBQcm9taXNlIHRvXG4gXHRcdFx0Ly8gYXZvaWQgdHJpZ2dlcmluZyB1bmNhdWdodCBleGNlcHRpb24gd2FybmluZyBpbiBDaHJvbWUuXG4gXHRcdFx0Ly8gU2VlIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTQ2NTY2NlxuIFx0XHRcdFByb21pc2UucmVzb2x2ZSgpXG4gXHRcdFx0XHQudGhlbihmdW5jdGlvbigpIHtcbiBcdFx0XHRcdFx0cmV0dXJuIGhvdEFwcGx5KGhvdEFwcGx5T25VcGRhdGUpO1xuIFx0XHRcdFx0fSlcbiBcdFx0XHRcdC50aGVuKFxuIFx0XHRcdFx0XHRmdW5jdGlvbihyZXN1bHQpIHtcbiBcdFx0XHRcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKHJlc3VsdCk7XG4gXHRcdFx0XHRcdH0sXG4gXHRcdFx0XHRcdGZ1bmN0aW9uKGVycikge1xuIFx0XHRcdFx0XHRcdGRlZmVycmVkLnJlamVjdChlcnIpO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHQpO1xuIFx0XHR9IGVsc2Uge1xuIFx0XHRcdHZhciBvdXRkYXRlZE1vZHVsZXMgPSBbXTtcbiBcdFx0XHRmb3IgKHZhciBpZCBpbiBob3RVcGRhdGUpIHtcbiBcdFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcbiBcdFx0XHRcdFx0b3V0ZGF0ZWRNb2R1bGVzLnB1c2godG9Nb2R1bGVJZChpZCkpO1xuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0XHRkZWZlcnJlZC5yZXNvbHZlKG91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdH1cbiBcdH1cblxuIFx0ZnVuY3Rpb24gaG90QXBwbHkob3B0aW9ucykge1xuIFx0XHRpZiAoaG90U3RhdHVzICE9PSBcInJlYWR5XCIpXG4gXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiYXBwbHkoKSBpcyBvbmx5IGFsbG93ZWQgaW4gcmVhZHkgc3RhdHVzXCIpO1xuIFx0XHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuIFx0XHR2YXIgY2I7XG4gXHRcdHZhciBpO1xuIFx0XHR2YXIgajtcbiBcdFx0dmFyIG1vZHVsZTtcbiBcdFx0dmFyIG1vZHVsZUlkO1xuXG4gXHRcdGZ1bmN0aW9uIGdldEFmZmVjdGVkU3R1ZmYodXBkYXRlTW9kdWxlSWQpIHtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWRNb2R1bGVzID0gW3VwZGF0ZU1vZHVsZUlkXTtcbiBcdFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcblxuIFx0XHRcdHZhciBxdWV1ZSA9IG91dGRhdGVkTW9kdWxlcy5zbGljZSgpLm1hcChmdW5jdGlvbihpZCkge1xuIFx0XHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdFx0Y2hhaW46IFtpZF0sXG4gXHRcdFx0XHRcdGlkOiBpZFxuIFx0XHRcdFx0fTtcbiBcdFx0XHR9KTtcbiBcdFx0XHR3aGlsZSAocXVldWUubGVuZ3RoID4gMCkge1xuIFx0XHRcdFx0dmFyIHF1ZXVlSXRlbSA9IHF1ZXVlLnBvcCgpO1xuIFx0XHRcdFx0dmFyIG1vZHVsZUlkID0gcXVldWVJdGVtLmlkO1xuIFx0XHRcdFx0dmFyIGNoYWluID0gcXVldWVJdGVtLmNoYWluO1xuIFx0XHRcdFx0bW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRpZiAoIW1vZHVsZSB8fCBtb2R1bGUuaG90Ll9zZWxmQWNjZXB0ZWQpIGNvbnRpbnVlO1xuIFx0XHRcdFx0aWYgKG1vZHVsZS5ob3QuX3NlbGZEZWNsaW5lZCkge1xuIFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1kZWNsaW5lZFwiLFxuIFx0XHRcdFx0XHRcdGNoYWluOiBjaGFpbixcbiBcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWRcbiBcdFx0XHRcdFx0fTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChtb2R1bGUuaG90Ll9tYWluKSB7XG4gXHRcdFx0XHRcdHJldHVybiB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJ1bmFjY2VwdGVkXCIsXG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBtb2R1bGUucGFyZW50cy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHR2YXIgcGFyZW50SWQgPSBtb2R1bGUucGFyZW50c1tpXTtcbiBcdFx0XHRcdFx0dmFyIHBhcmVudCA9IGluc3RhbGxlZE1vZHVsZXNbcGFyZW50SWRdO1xuIFx0XHRcdFx0XHRpZiAoIXBhcmVudCkgY29udGludWU7XG4gXHRcdFx0XHRcdGlmIChwYXJlbnQuaG90Ll9kZWNsaW5lZERlcGVuZGVuY2llc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRcdFx0XHRyZXR1cm4ge1xuIFx0XHRcdFx0XHRcdFx0dHlwZTogXCJkZWNsaW5lZFwiLFxuIFx0XHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcbiBcdFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBtb2R1bGVJZCxcbiBcdFx0XHRcdFx0XHRcdHBhcmVudElkOiBwYXJlbnRJZFxuIFx0XHRcdFx0XHRcdH07XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0aWYgKG91dGRhdGVkTW9kdWxlcy5pbmRleE9mKHBhcmVudElkKSAhPT0gLTEpIGNvbnRpbnVlO1xuIFx0XHRcdFx0XHRpZiAocGFyZW50LmhvdC5fYWNjZXB0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0XHRcdFx0aWYgKCFvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0pXG4gXHRcdFx0XHRcdFx0XHRvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0gPSBbXTtcbiBcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF0sIFttb2R1bGVJZF0pO1xuIFx0XHRcdFx0XHRcdGNvbnRpbnVlO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGRlbGV0ZSBvdXRkYXRlZERlcGVuZGVuY2llc1twYXJlbnRJZF07XG4gXHRcdFx0XHRcdG91dGRhdGVkTW9kdWxlcy5wdXNoKHBhcmVudElkKTtcbiBcdFx0XHRcdFx0cXVldWUucHVzaCh7XG4gXHRcdFx0XHRcdFx0Y2hhaW46IGNoYWluLmNvbmNhdChbcGFyZW50SWRdKSxcbiBcdFx0XHRcdFx0XHRpZDogcGFyZW50SWRcbiBcdFx0XHRcdFx0fSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuXG4gXHRcdFx0cmV0dXJuIHtcbiBcdFx0XHRcdHR5cGU6IFwiYWNjZXB0ZWRcIixcbiBcdFx0XHRcdG1vZHVsZUlkOiB1cGRhdGVNb2R1bGVJZCxcbiBcdFx0XHRcdG91dGRhdGVkTW9kdWxlczogb3V0ZGF0ZWRNb2R1bGVzLFxuIFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXM6IG91dGRhdGVkRGVwZW5kZW5jaWVzXG4gXHRcdFx0fTtcbiBcdFx0fVxuXG4gXHRcdGZ1bmN0aW9uIGFkZEFsbFRvU2V0KGEsIGIpIHtcbiBcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGIubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdHZhciBpdGVtID0gYltpXTtcbiBcdFx0XHRcdGlmIChhLmluZGV4T2YoaXRlbSkgPT09IC0xKSBhLnB1c2goaXRlbSk7XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gYXQgYmVnaW4gYWxsIHVwZGF0ZXMgbW9kdWxlcyBhcmUgb3V0ZGF0ZWRcbiBcdFx0Ly8gdGhlIFwib3V0ZGF0ZWRcIiBzdGF0dXMgY2FuIHByb3BhZ2F0ZSB0byBwYXJlbnRzIGlmIHRoZXkgZG9uJ3QgYWNjZXB0IHRoZSBjaGlsZHJlblxuIFx0XHR2YXIgb3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSB7fTtcbiBcdFx0dmFyIG91dGRhdGVkTW9kdWxlcyA9IFtdO1xuIFx0XHR2YXIgYXBwbGllZFVwZGF0ZSA9IHt9O1xuXG4gXHRcdHZhciB3YXJuVW5leHBlY3RlZFJlcXVpcmUgPSBmdW5jdGlvbiB3YXJuVW5leHBlY3RlZFJlcXVpcmUoKSB7XG4gXHRcdFx0Y29uc29sZS53YXJuKFxuIFx0XHRcdFx0XCJbSE1SXSB1bmV4cGVjdGVkIHJlcXVpcmUoXCIgKyByZXN1bHQubW9kdWxlSWQgKyBcIikgdG8gZGlzcG9zZWQgbW9kdWxlXCJcbiBcdFx0XHQpO1xuIFx0XHR9O1xuXG4gXHRcdGZvciAodmFyIGlkIGluIGhvdFVwZGF0ZSkge1xuIFx0XHRcdGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoaG90VXBkYXRlLCBpZCkpIHtcbiBcdFx0XHRcdG1vZHVsZUlkID0gdG9Nb2R1bGVJZChpZCk7XG4gXHRcdFx0XHQvKiogQHR5cGUge1RPRE99ICovXG4gXHRcdFx0XHR2YXIgcmVzdWx0O1xuIFx0XHRcdFx0aWYgKGhvdFVwZGF0ZVtpZF0pIHtcbiBcdFx0XHRcdFx0cmVzdWx0ID0gZ2V0QWZmZWN0ZWRTdHVmZihtb2R1bGVJZCk7XG4gXHRcdFx0XHR9IGVsc2Uge1xuIFx0XHRcdFx0XHRyZXN1bHQgPSB7XG4gXHRcdFx0XHRcdFx0dHlwZTogXCJkaXNwb3NlZFwiLFxuIFx0XHRcdFx0XHRcdG1vZHVsZUlkOiBpZFxuIFx0XHRcdFx0XHR9O1xuIFx0XHRcdFx0fVxuIFx0XHRcdFx0LyoqIEB0eXBlIHtFcnJvcnxmYWxzZX0gKi9cbiBcdFx0XHRcdHZhciBhYm9ydEVycm9yID0gZmFsc2U7XG4gXHRcdFx0XHR2YXIgZG9BcHBseSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGRvRGlzcG9zZSA9IGZhbHNlO1xuIFx0XHRcdFx0dmFyIGNoYWluSW5mbyA9IFwiXCI7XG4gXHRcdFx0XHRpZiAocmVzdWx0LmNoYWluKSB7XG4gXHRcdFx0XHRcdGNoYWluSW5mbyA9IFwiXFxuVXBkYXRlIHByb3BhZ2F0aW9uOiBcIiArIHJlc3VsdC5jaGFpbi5qb2luKFwiIC0+IFwiKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdHN3aXRjaCAocmVzdWx0LnR5cGUpIHtcbiBcdFx0XHRcdFx0Y2FzZSBcInNlbGYtZGVjbGluZWRcIjpcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkRlY2xpbmVkKSBvcHRpb25zLm9uRGVjbGluZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlRGVjbGluZWQpXG4gXHRcdFx0XHRcdFx0XHRhYm9ydEVycm9yID0gbmV3IEVycm9yKFxuIFx0XHRcdFx0XHRcdFx0XHRcIkFib3J0ZWQgYmVjYXVzZSBvZiBzZWxmIGRlY2xpbmU6IFwiICtcbiBcdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQubW9kdWxlSWQgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImRlY2xpbmVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25EZWNsaW5lZCkgb3B0aW9ucy5vbkRlY2xpbmVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZURlY2xpbmVkKVxuIFx0XHRcdFx0XHRcdFx0YWJvcnRFcnJvciA9IG5ldyBFcnJvcihcbiBcdFx0XHRcdFx0XHRcdFx0XCJBYm9ydGVkIGJlY2F1c2Ugb2YgZGVjbGluZWQgZGVwZW5kZW5jeTogXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5tb2R1bGVJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0XCIgaW4gXCIgK1xuIFx0XHRcdFx0XHRcdFx0XHRcdHJlc3VsdC5wYXJlbnRJZCArXG4gXHRcdFx0XHRcdFx0XHRcdFx0Y2hhaW5JbmZvXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdGJyZWFrO1xuIFx0XHRcdFx0XHRjYXNlIFwidW5hY2NlcHRlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uVW5hY2NlcHRlZCkgb3B0aW9ucy5vblVuYWNjZXB0ZWQocmVzdWx0KTtcbiBcdFx0XHRcdFx0XHRpZiAoIW9wdGlvbnMuaWdub3JlVW5hY2NlcHRlZClcbiBcdFx0XHRcdFx0XHRcdGFib3J0RXJyb3IgPSBuZXcgRXJyb3IoXG4gXHRcdFx0XHRcdFx0XHRcdFwiQWJvcnRlZCBiZWNhdXNlIFwiICsgbW9kdWxlSWQgKyBcIiBpcyBub3QgYWNjZXB0ZWRcIiArIGNoYWluSW5mb1xuIFx0XHRcdFx0XHRcdFx0KTtcbiBcdFx0XHRcdFx0XHRicmVhaztcbiBcdFx0XHRcdFx0Y2FzZSBcImFjY2VwdGVkXCI6XG4gXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMub25BY2NlcHRlZCkgb3B0aW9ucy5vbkFjY2VwdGVkKHJlc3VsdCk7XG4gXHRcdFx0XHRcdFx0ZG9BcHBseSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGNhc2UgXCJkaXNwb3NlZFwiOlxuIFx0XHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRGlzcG9zZWQpIG9wdGlvbnMub25EaXNwb3NlZChyZXN1bHQpO1xuIFx0XHRcdFx0XHRcdGRvRGlzcG9zZSA9IHRydWU7XG4gXHRcdFx0XHRcdFx0YnJlYWs7XG4gXHRcdFx0XHRcdGRlZmF1bHQ6XG4gXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leGNlcHRpb24gdHlwZSBcIiArIHJlc3VsdC50eXBlKTtcbiBcdFx0XHRcdH1cbiBcdFx0XHRcdGlmIChhYm9ydEVycm9yKSB7XG4gXHRcdFx0XHRcdGhvdFNldFN0YXR1cyhcImFib3J0XCIpO1xuIFx0XHRcdFx0XHRyZXR1cm4gUHJvbWlzZS5yZWplY3QoYWJvcnRFcnJvcik7XG4gXHRcdFx0XHR9XG4gXHRcdFx0XHRpZiAoZG9BcHBseSkge1xuIFx0XHRcdFx0XHRhcHBsaWVkVXBkYXRlW21vZHVsZUlkXSA9IGhvdFVwZGF0ZVttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGFkZEFsbFRvU2V0KG91dGRhdGVkTW9kdWxlcywgcmVzdWx0Lm91dGRhdGVkTW9kdWxlcyk7XG4gXHRcdFx0XHRcdGZvciAobW9kdWxlSWQgaW4gcmVzdWx0Lm91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0XHRcdFx0aWYgKFxuIFx0XHRcdFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXMsXG4gXHRcdFx0XHRcdFx0XHRcdG1vZHVsZUlkXG4gXHRcdFx0XHRcdFx0XHQpXG4gXHRcdFx0XHRcdFx0KSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAoIW91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXSlcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdID0gW107XG4gXHRcdFx0XHRcdFx0XHRhZGRBbGxUb1NldChcbiBcdFx0XHRcdFx0XHRcdFx0b3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdLFxuIFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQub3V0ZGF0ZWREZXBlbmRlbmNpZXNbbW9kdWxlSWRdXG4gXHRcdFx0XHRcdFx0XHQpO1xuIFx0XHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdFx0aWYgKGRvRGlzcG9zZSkge1xuIFx0XHRcdFx0XHRhZGRBbGxUb1NldChvdXRkYXRlZE1vZHVsZXMsIFtyZXN1bHQubW9kdWxlSWRdKTtcbiBcdFx0XHRcdFx0YXBwbGllZFVwZGF0ZVttb2R1bGVJZF0gPSB3YXJuVW5leHBlY3RlZFJlcXVpcmU7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gU3RvcmUgc2VsZiBhY2NlcHRlZCBvdXRkYXRlZCBtb2R1bGVzIHRvIHJlcXVpcmUgdGhlbSBsYXRlciBieSB0aGUgbW9kdWxlIHN5c3RlbVxuIFx0XHR2YXIgb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzID0gW107XG4gXHRcdGZvciAoaSA9IDA7IGkgPCBvdXRkYXRlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRtb2R1bGVJZCA9IG91dGRhdGVkTW9kdWxlc1tpXTtcbiBcdFx0XHRpZiAoXG4gXHRcdFx0XHRpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSAmJlxuIFx0XHRcdFx0aW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcbiBcdFx0XHQpXG4gXHRcdFx0XHRvdXRkYXRlZFNlbGZBY2NlcHRlZE1vZHVsZXMucHVzaCh7XG4gXHRcdFx0XHRcdG1vZHVsZTogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdGVycm9ySGFuZGxlcjogaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uaG90Ll9zZWxmQWNjZXB0ZWRcbiBcdFx0XHRcdH0pO1xuIFx0XHR9XG5cbiBcdFx0Ly8gTm93IGluIFwiZGlzcG9zZVwiIHBoYXNlXG4gXHRcdGhvdFNldFN0YXR1cyhcImRpc3Bvc2VcIik7XG4gXHRcdE9iamVjdC5rZXlzKGhvdEF2YWlsYWJsZUZpbGVzTWFwKS5mb3JFYWNoKGZ1bmN0aW9uKGNodW5rSWQpIHtcbiBcdFx0XHRpZiAoaG90QXZhaWxhYmxlRmlsZXNNYXBbY2h1bmtJZF0gPT09IGZhbHNlKSB7XG4gXHRcdFx0XHRob3REaXNwb3NlQ2h1bmsoY2h1bmtJZCk7XG4gXHRcdFx0fVxuIFx0XHR9KTtcblxuIFx0XHR2YXIgaWR4O1xuIFx0XHR2YXIgcXVldWUgPSBvdXRkYXRlZE1vZHVsZXMuc2xpY2UoKTtcbiBcdFx0d2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiBcdFx0XHRtb2R1bGVJZCA9IHF1ZXVlLnBvcCgpO1xuIFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdGlmICghbW9kdWxlKSBjb250aW51ZTtcblxuIFx0XHRcdHZhciBkYXRhID0ge307XG5cbiBcdFx0XHQvLyBDYWxsIGRpc3Bvc2UgaGFuZGxlcnNcbiBcdFx0XHR2YXIgZGlzcG9zZUhhbmRsZXJzID0gbW9kdWxlLmhvdC5fZGlzcG9zZUhhbmRsZXJzO1xuIFx0XHRcdGZvciAoaiA9IDA7IGogPCBkaXNwb3NlSGFuZGxlcnMubGVuZ3RoOyBqKyspIHtcbiBcdFx0XHRcdGNiID0gZGlzcG9zZUhhbmRsZXJzW2pdO1xuIFx0XHRcdFx0Y2IoZGF0YSk7XG4gXHRcdFx0fVxuIFx0XHRcdGhvdEN1cnJlbnRNb2R1bGVEYXRhW21vZHVsZUlkXSA9IGRhdGE7XG5cbiBcdFx0XHQvLyBkaXNhYmxlIG1vZHVsZSAodGhpcyBkaXNhYmxlcyByZXF1aXJlcyBmcm9tIHRoaXMgbW9kdWxlKVxuIFx0XHRcdG1vZHVsZS5ob3QuYWN0aXZlID0gZmFsc2U7XG5cbiBcdFx0XHQvLyByZW1vdmUgbW9kdWxlIGZyb20gY2FjaGVcbiBcdFx0XHRkZWxldGUgaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF07XG5cbiBcdFx0XHQvLyB3aGVuIGRpc3Bvc2luZyB0aGVyZSBpcyBubyBuZWVkIHRvIGNhbGwgZGlzcG9zZSBoYW5kbGVyXG4gXHRcdFx0ZGVsZXRlIG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcblxuIFx0XHRcdC8vIHJlbW92ZSBcInBhcmVudHNcIiByZWZlcmVuY2VzIGZyb20gYWxsIGNoaWxkcmVuXG4gXHRcdFx0Zm9yIChqID0gMDsgaiA8IG1vZHVsZS5jaGlsZHJlbi5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0dmFyIGNoaWxkID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGUuY2hpbGRyZW5bal1dO1xuIFx0XHRcdFx0aWYgKCFjaGlsZCkgY29udGludWU7XG4gXHRcdFx0XHRpZHggPSBjaGlsZC5wYXJlbnRzLmluZGV4T2YobW9kdWxlSWQpO1xuIFx0XHRcdFx0aWYgKGlkeCA+PSAwKSB7XG4gXHRcdFx0XHRcdGNoaWxkLnBhcmVudHMuc3BsaWNlKGlkeCwgMSk7XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gcmVtb3ZlIG91dGRhdGVkIGRlcGVuZGVuY3kgZnJvbSBtb2R1bGUgY2hpbGRyZW5cbiBcdFx0dmFyIGRlcGVuZGVuY3k7XG4gXHRcdHZhciBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcztcbiBcdFx0Zm9yIChtb2R1bGVJZCBpbiBvdXRkYXRlZERlcGVuZGVuY2llcykge1xuIFx0XHRcdGlmIChcbiBcdFx0XHRcdE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvdXRkYXRlZERlcGVuZGVuY2llcywgbW9kdWxlSWQpXG4gXHRcdFx0KSB7XG4gXHRcdFx0XHRtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdGlmIChtb2R1bGUpIHtcbiBcdFx0XHRcdFx0bW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMgPSBvdXRkYXRlZERlcGVuZGVuY2llc1ttb2R1bGVJZF07XG4gXHRcdFx0XHRcdGZvciAoaiA9IDA7IGogPCBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcy5sZW5ndGg7IGorKykge1xuIFx0XHRcdFx0XHRcdGRlcGVuZGVuY3kgPSBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tqXTtcbiBcdFx0XHRcdFx0XHRpZHggPSBtb2R1bGUuY2hpbGRyZW4uaW5kZXhPZihkZXBlbmRlbmN5KTtcbiBcdFx0XHRcdFx0XHRpZiAoaWR4ID49IDApIG1vZHVsZS5jaGlsZHJlbi5zcGxpY2UoaWR4LCAxKTtcbiBcdFx0XHRcdFx0fVxuIFx0XHRcdFx0fVxuIFx0XHRcdH1cbiBcdFx0fVxuXG4gXHRcdC8vIE5vdCBpbiBcImFwcGx5XCIgcGhhc2VcbiBcdFx0aG90U2V0U3RhdHVzKFwiYXBwbHlcIik7XG5cbiBcdFx0aG90Q3VycmVudEhhc2ggPSBob3RVcGRhdGVOZXdIYXNoO1xuXG4gXHRcdC8vIGluc2VydCBuZXcgY29kZVxuIFx0XHRmb3IgKG1vZHVsZUlkIGluIGFwcGxpZWRVcGRhdGUpIHtcbiBcdFx0XHRpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwcGxpZWRVcGRhdGUsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBhcHBsaWVkVXBkYXRlW21vZHVsZUlkXTtcbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBjYWxsIGFjY2VwdCBoYW5kbGVyc1xuIFx0XHR2YXIgZXJyb3IgPSBudWxsO1xuIFx0XHRmb3IgKG1vZHVsZUlkIGluIG91dGRhdGVkRGVwZW5kZW5jaWVzKSB7XG4gXHRcdFx0aWYgKFxuIFx0XHRcdFx0T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG91dGRhdGVkRGVwZW5kZW5jaWVzLCBtb2R1bGVJZClcbiBcdFx0XHQpIHtcbiBcdFx0XHRcdG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdO1xuIFx0XHRcdFx0aWYgKG1vZHVsZSkge1xuIFx0XHRcdFx0XHRtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyA9IG91dGRhdGVkRGVwZW5kZW5jaWVzW21vZHVsZUlkXTtcbiBcdFx0XHRcdFx0dmFyIGNhbGxiYWNrcyA9IFtdO1xuIFx0XHRcdFx0XHRmb3IgKGkgPSAwOyBpIDwgbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHRcdFx0XHRkZXBlbmRlbmN5ID0gbW9kdWxlT3V0ZGF0ZWREZXBlbmRlbmNpZXNbaV07XG4gXHRcdFx0XHRcdFx0Y2IgPSBtb2R1bGUuaG90Ll9hY2NlcHRlZERlcGVuZGVuY2llc1tkZXBlbmRlbmN5XTtcbiBcdFx0XHRcdFx0XHRpZiAoY2IpIHtcbiBcdFx0XHRcdFx0XHRcdGlmIChjYWxsYmFja3MuaW5kZXhPZihjYikgIT09IC0xKSBjb250aW51ZTtcbiBcdFx0XHRcdFx0XHRcdGNhbGxiYWNrcy5wdXNoKGNiKTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdFx0Zm9yIChpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdFx0XHRcdGNiID0gY2FsbGJhY2tzW2ldO1xuIFx0XHRcdFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRcdFx0XHRjYihtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llcyk7XG4gXHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyKSB7XG4gXHRcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0b3B0aW9ucy5vbkVycm9yZWQoe1xuIFx0XHRcdFx0XHRcdFx0XHRcdHR5cGU6IFwiYWNjZXB0LWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0XHRtb2R1bGVJZDogbW9kdWxlSWQsXG4gXHRcdFx0XHRcdFx0XHRcdFx0ZGVwZW5kZW5jeUlkOiBtb2R1bGVPdXRkYXRlZERlcGVuZGVuY2llc1tpXSxcbiBcdFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0fVxuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHR9XG4gXHRcdFx0fVxuIFx0XHR9XG5cbiBcdFx0Ly8gTG9hZCBzZWxmIGFjY2VwdGVkIG1vZHVsZXNcbiBcdFx0Zm9yIChpID0gMDsgaSA8IG91dGRhdGVkU2VsZkFjY2VwdGVkTW9kdWxlcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdHZhciBpdGVtID0gb3V0ZGF0ZWRTZWxmQWNjZXB0ZWRNb2R1bGVzW2ldO1xuIFx0XHRcdG1vZHVsZUlkID0gaXRlbS5tb2R1bGU7XG4gXHRcdFx0aG90Q3VycmVudFBhcmVudHMgPSBbbW9kdWxlSWRdO1xuIFx0XHRcdHRyeSB7XG4gXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKTtcbiBcdFx0XHR9IGNhdGNoIChlcnIpIHtcbiBcdFx0XHRcdGlmICh0eXBlb2YgaXRlbS5lcnJvckhhbmRsZXIgPT09IFwiZnVuY3Rpb25cIikge1xuIFx0XHRcdFx0XHR0cnkge1xuIFx0XHRcdFx0XHRcdGl0ZW0uZXJyb3JIYW5kbGVyKGVycik7XG4gXHRcdFx0XHRcdH0gY2F0Y2ggKGVycjIpIHtcbiBcdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5vbkVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdFx0dHlwZTogXCJzZWxmLWFjY2VwdC1lcnJvci1oYW5kbGVyLWVycm9yZWRcIixcbiBcdFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0XHRlcnJvcjogZXJyMixcbiBcdFx0XHRcdFx0XHRcdFx0b3JpZ2luYWxFcnJvcjogZXJyXG4gXHRcdFx0XHRcdFx0XHR9KTtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFvcHRpb25zLmlnbm9yZUVycm9yZWQpIHtcbiBcdFx0XHRcdFx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZXJyMjtcbiBcdFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH0gZWxzZSB7XG4gXHRcdFx0XHRcdGlmIChvcHRpb25zLm9uRXJyb3JlZCkge1xuIFx0XHRcdFx0XHRcdG9wdGlvbnMub25FcnJvcmVkKHtcbiBcdFx0XHRcdFx0XHRcdHR5cGU6IFwic2VsZi1hY2NlcHQtZXJyb3JlZFwiLFxuIFx0XHRcdFx0XHRcdFx0bW9kdWxlSWQ6IG1vZHVsZUlkLFxuIFx0XHRcdFx0XHRcdFx0ZXJyb3I6IGVyclxuIFx0XHRcdFx0XHRcdH0pO1xuIFx0XHRcdFx0XHR9XG4gXHRcdFx0XHRcdGlmICghb3B0aW9ucy5pZ25vcmVFcnJvcmVkKSB7XG4gXHRcdFx0XHRcdFx0aWYgKCFlcnJvcikgZXJyb3IgPSBlcnI7XG4gXHRcdFx0XHRcdH1cbiBcdFx0XHRcdH1cbiBcdFx0XHR9XG4gXHRcdH1cblxuIFx0XHQvLyBoYW5kbGUgZXJyb3JzIGluIGFjY2VwdCBoYW5kbGVycyBhbmQgc2VsZiBhY2NlcHRlZCBtb2R1bGUgbG9hZFxuIFx0XHRpZiAoZXJyb3IpIHtcbiBcdFx0XHRob3RTZXRTdGF0dXMoXCJmYWlsXCIpO1xuIFx0XHRcdHJldHVybiBQcm9taXNlLnJlamVjdChlcnJvcik7XG4gXHRcdH1cblxuIFx0XHRob3RTZXRTdGF0dXMoXCJpZGxlXCIpO1xuIFx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSkge1xuIFx0XHRcdHJlc29sdmUob3V0ZGF0ZWRNb2R1bGVzKTtcbiBcdFx0fSk7XG4gXHR9XG5cbiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGhvdDogaG90Q3JlYXRlTW9kdWxlKG1vZHVsZUlkKSxcbiBcdFx0XHRwYXJlbnRzOiAoaG90Q3VycmVudFBhcmVudHNUZW1wID0gaG90Q3VycmVudFBhcmVudHMsIGhvdEN1cnJlbnRQYXJlbnRzID0gW10sIGhvdEN1cnJlbnRQYXJlbnRzVGVtcCksXG4gXHRcdFx0Y2hpbGRyZW46IFtdXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIGhvdENyZWF0ZVJlcXVpcmUobW9kdWxlSWQpKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gX193ZWJwYWNrX2hhc2hfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5oID0gZnVuY3Rpb24oKSB7IHJldHVybiBob3RDdXJyZW50SGFzaDsgfTtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBob3RDcmVhdGVSZXF1aXJlKFwiLi9zcmMvanMvaW5kZXguanNcIikoX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9qcy9pbmRleC5qc1wiKTtcbiIsInZhciBlc2NhcGUgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL3VybC9lc2NhcGUuanNcIik7XG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKGZhbHNlKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcImJvZHkge1xcbiAgYmFja2dyb3VuZDogI0YyRjJGMjtcXG4gIGZvbnQtZmFtaWx5OiAnU3VuZmxvd2VyJywgc2Fucy1zZXJpZjtcXG59XFxuLmJveC1ib3JkZXIge1xcbiAgYm9yZGVyOiAzcHggc29saWQgI0Q5RTNGMDtcXG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XFxufVxcbiNjb250YWluZXIge1xcbiAgcGFkZGluZzogMTAwcHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgd2lkdGg6IDE0MDBweDtcXG4gIGhlaWdodDogMTMwMHB4O1xcbiAgbWFyZ2luOiBhdXRvO1xcbiAgZGlzcGxheTogZmxleDtcXG59XFxuI2xlZnQge1xcbiAgZmxleDogMTtcXG59XFxuI3JpZ2h0IHtcXG4gIGZsZXg6IDE7XFxufVxcbiNjb2xvcnMge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcXG4gIG1hcmdpbi1ib3R0b206IDUwcHg7XFxufVxcbiNjb2xvcnMgLmNvbG9yLWJsb2NrIHtcXG4gIGhlaWdodDogMTIwcHg7XFxuICB3aWR0aDogMTIwcHg7XFxuICBib3JkZXItcmFkaXVzOiA4cHg7XFxufVxcbiNjb2xvcnMgLmNvbG9yLTEge1xcbiAgYmFja2dyb3VuZDogIzJDQ0NFNDtcXG59XFxuI2NvbG9ycyAuY29sb3ItMiB7XFxuICBiYWNrZ3JvdW5kOiAjMzdENjdBO1xcbn1cXG4jY29sb3JzIC5jb2xvci0zIHtcXG4gIGJhY2tncm91bmQ6ICM2OTc2ODk7XFxufVxcbiNjb2xvcnMgLmNvbG9yLTQge1xcbiAgYmFja2dyb3VuZDogI0Q5RTNGMDtcXG59XFxuLnR5cGVtb2RhbCB7XFxuICBib3JkZXI6IDNweCBzb2xpZCAjRDlFM0YwO1xcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcXG4gIHBhZGRpbmc6IDUwcHg7XFxufVxcbi50eXBlbW9kYWwgaDIge1xcbiAgZm9udC1zaXplOiAzOHB4O1xcbn1cXG4udHlwZW1vZGFsIC5zdWJ0aXRsZSB7XFxuICBjb2xvcjogI0Q5RTNGMDtcXG59XFxuLnR5cGVtb2RhbCAuY29udGVudCB7XFxuICBmb250LXNpemU6IDMwcHg7XFxuICBsaW5lLWhlaWdodDogNTBweDtcXG59XFxuI2J1dHRvbnMgYnV0dG9uIHtcXG4gIG1hcmdpbjogMjBweCA1MHB4O1xcbiAgb3V0bGluZTogbm9uZTtcXG59XFxuI2J1dHRvbnMgLmJ1dHRvbiB7XFxuICB3aWR0aDogMjQwcHg7XFxuICBoZWlnaHQ6IDEwMHB4O1xcbiAgYm9yZGVyOiA0cHggc29saWQ7XFxuICBib3JkZXItcmFkaXVzOiA4cHg7XFxuICBmb250LXNpemU6IDMwcHg7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbiNidXR0b25zIC5wcmltYXJ5IHtcXG4gIGJhY2tncm91bmQ6ICMyQ0NDRTQ7XFxuICBjb2xvcjogI2ZmZjtcXG4gIGJvcmRlci1jb2xvcjogIzJDQ0NFNDtcXG59XFxuI2J1dHRvbnMgLnByaW1hcnk6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzg2ZTJmMDtcXG59XFxuI2J1dHRvbnMgLnByaW1hcnktZW1wdHkge1xcbiAgYmFja2dyb3VuZDogI2ZmZjtcXG4gIGNvbG9yOiAjMkNDQ0U0O1xcbiAgYm9yZGVyLWNvbG9yOiAjMkNDQ0U0O1xcbn1cXG4jYnV0dG9ucyAucHJpbWFyeS1lbXB0eTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjhmOGY5O1xcbn1cXG4jYnV0dG9ucyAuaW5mbyB7XFxuICBiYWNrZ3JvdW5kOiAjMzdENjdBO1xcbiAgY29sb3I6ICNmZmY7XFxuICBib3JkZXItY29sb3I6ICMzN0Q2N0E7XFxufVxcbiNidXR0b25zIC5pbmZvOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM4Y2U3YjI7XFxufVxcbiNidXR0b25zIC5pbmZvLWVtcHR5IHtcXG4gIGJhY2tncm91bmQ6ICNmZmY7XFxuICBjb2xvcjogIzM3RDY3QTtcXG4gIGJvcmRlci1jb2xvcjogIzM3RDY3QTtcXG59XFxuI2J1dHRvbnMgLmluZm8tZW1wdHk6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjhmOTtcXG59XFxuI2J1dHRvbnMgLmRpc2FibGUge1xcbiAgYmFja2dyb3VuZDogIzY5NzY4OTtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgYm9yZGVyLWNvbG9yOiAjNjk3Njg5O1xcbn1cXG4jYnV0dG9ucyAuZGlzYWJsZTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYTFhYWI3O1xcbn1cXG4jYnV0dG9ucyAuZGlzYWJsZS1lbXB0eSB7XFxuICBiYWNrZ3JvdW5kOiAjZmZmO1xcbiAgY29sb3I6ICM2OTc2ODk7XFxuICBib3JkZXItY29sb3I6ICM2OTc2ODk7XFxufVxcbiNidXR0b25zIC5kaXNhYmxlLWVtcHR5OmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmOGY4Zjk7XFxufVxcbiNmb3JtcyB7XFxuICBtYXJnaW4tbGVmdDogNTBweDtcXG4gIG1hcmdpbi10b3A6IDIwcHg7XFxufVxcbiNmb3JtcyBpbnB1dCB7XFxuICBtYXJnaW4tYm90dG9tOiA1MHB4O1xcbiAgb3V0bGluZTogbm9uZTtcXG59XFxuI2Zvcm1zIC50ZXh0IHtcXG4gIHdpZHRoOiA1MzBweDtcXG4gIGhlaWdodDogMTAwcHg7XFxuICBsaW5lLWhlaWdodDogMTAwcHg7XFxuICBmb250LXNpemU6IDMwcHg7XFxuICBib3JkZXI6IDNweCBzb2xpZCAjRDlFM0YwO1xcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcXG4gIHBhZGRpbmctbGVmdDogMzBweDtcXG4gIGNvbG9yOiAjRDlFM0YwO1xcbn1cXG4jZm9ybXMgLnRleHQ6OnBsYWNlaG9sZGVyIHtcXG4gIGNvbG9yOiAjRDlFM0YwO1xcbn1cXG4jZm9ybXMgLmRpc2FibGUge1xcbiAgYm9yZGVyLWNvbG9yOiAjRDlFM0YwO1xcbiAgY29sb3I6ICNEOUUzRjA7XFxufVxcbiNmb3JtcyAud3Jvbmcge1xcbiAgYm9yZGVyLWNvbG9yOiAjRjQ3MzczO1xcbiAgY29sb3I6ICNGNDczNzM7XFxufVxcbiNmb3JtcyAudHlwZWQge1xcbiAgYm9yZGVyLWNvbG9yOiAjMkNDQ0U0O1xcbiAgY29sb3I6ICMyQ0NDRTQ7XFxufVxcbi5zd2l0Y2gge1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgd2lkdGg6IDEwMHB4O1xcbiAgaGVpZ2h0OiA1MHB4O1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI0Q5RTNGMDtcXG4gIGJvcmRlci1yYWRpdXM6IDI1cHg7XFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG4gIC1tb3otYXBwZWFyYW5jZTogbm9uZTtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC41cztcXG4gIG91dGxpbmU6IG5vbmU7XFxufVxcbi5zd2l0Y2g6OmJlZm9yZSB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGhlaWdodDogNDBweDtcXG4gIHdpZHRoOiA0MHB4O1xcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gIHRvcDogNXB4O1xcbiAgbGVmdDogNXB4O1xcbiAgdHJhbnNpdGlvbjogbGVmdCAwLjVzO1xcbn1cXG4uc3dpdGNoOmNoZWNrZWQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzM3RDY3QTtcXG59XFxuLnN3aXRjaDpjaGVja2VkOmJlZm9yZSB7XFxuICBjb250ZW50OiAnJztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGhlaWdodDogNDBweDtcXG4gIHdpZHRoOiA0MHB4O1xcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gIHRvcDogNXB4O1xcbiAgbGVmdDogNTVweDtcXG59XFxuI3RvcCB7XFxuICBtYXJnaW4tbGVmdDogNTBweDtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBtYXJnaW4tYm90dG9tOiA1MHB4O1xcbn1cXG4ucmFuZ2VyIHtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICAtd2Via2l0LWFwcGVhcmFuY2U6IG5vbmU7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgd2lkdGg6IDM1MHB4O1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgbWluLWhlaWdodDogNDBweDtcXG59XFxuLnJhbmdlcjo6LXdlYmtpdC1zbGlkZXItcnVubmFibGUtdHJhY2sge1xcbiAgaGVpZ2h0OiA2cHg7XFxuICBjb250ZW50OiAnJztcXG4gIGJhY2tncm91bmQtY29sb3I6ICMyQ0NDRTQ7XFxufVxcbi5yYW5nZXI6Oi13ZWJraXQtc2xpZGVyLXRodW1iIHtcXG4gIC13ZWJraXQtYXBwZWFyYW5jZTogbm9uZTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICBoZWlnaHQ6IDMwcHg7XFxuICB3aWR0aDogMzBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gIGJvcmRlcjogNHB4IHNvbGlkICMyQ0NDRTQ7XFxuICBtYXJnaW4tdG9wOiAtMTJweDtcXG4gIG1hcmdpbi1ib3R0b206IC01cHg7XFxuICBib3gtc2hhZG93OiAxcHggMCAwIC0xMnB4ICNjN2M3YzcsIDJweCAwIDAgLTEycHggI2M3YzdjNywgM3B4IDAgMCAtMTJweCAjYzdjN2M3LCA0cHggMCAwIC0xMnB4ICNjN2M3YzcsIDVweCAwIDAgLTEycHggI2M3YzdjNywgNnB4IDAgMCAtMTJweCAjYzdjN2M3LCA3cHggMCAwIC0xMnB4ICNjN2M3YzcsIDhweCAwIDAgLTEycHggI2M3YzdjNywgOXB4IDAgMCAtMTJweCAjYzdjN2M3LCAxMHB4IDAgMCAtMTJweCAjYzdjN2M3LCAxMXB4IDAgMCAtMTJweCAjYzdjN2M3LCAxMnB4IDAgMCAtMTJweCAjYzdjN2M3LCAxM3B4IDAgMCAtMTJweCAjYzdjN2M3LCAxNHB4IDAgMCAtMTJweCAjYzdjN2M3LCAxNXB4IDAgMCAtMTJweCAjYzdjN2M3LCAxNnB4IDAgMCAtMTJweCAjYzdjN2M3LCAxN3B4IDAgMCAtMTJweCAjYzdjN2M3LCAxOHB4IDAgMCAtMTJweCAjYzdjN2M3LCAxOXB4IDAgMCAtMTJweCAjYzdjN2M3LCAyMHB4IDAgMCAtMTJweCAjYzdjN2M3LCAyMXB4IDAgMCAtMTJweCAjYzdjN2M3LCAyMnB4IDAgMCAtMTJweCAjYzdjN2M3LCAyM3B4IDAgMCAtMTJweCAjYzdjN2M3LCAyNHB4IDAgMCAtMTJweCAjYzdjN2M3LCAyNXB4IDAgMCAtMTJweCAjYzdjN2M3LCAyNnB4IDAgMCAtMTJweCAjYzdjN2M3LCAyN3B4IDAgMCAtMTJweCAjYzdjN2M3LCAyOHB4IDAgMCAtMTJweCAjYzdjN2M3LCAyOXB4IDAgMCAtMTJweCAjYzdjN2M3LCAzMHB4IDAgMCAtMTJweCAjYzdjN2M3LCAzMXB4IDAgMCAtMTJweCAjYzdjN2M3LCAzMnB4IDAgMCAtMTJweCAjYzdjN2M3LCAzM3B4IDAgMCAtMTJweCAjYzdjN2M3LCAzNHB4IDAgMCAtMTJweCAjYzdjN2M3LCAzNXB4IDAgMCAtMTJweCAjYzdjN2M3LCAzNnB4IDAgMCAtMTJweCAjYzdjN2M3LCAzN3B4IDAgMCAtMTJweCAjYzdjN2M3LCAzOHB4IDAgMCAtMTJweCAjYzdjN2M3LCAzOXB4IDAgMCAtMTJweCAjYzdjN2M3LCA0MHB4IDAgMCAtMTJweCAjYzdjN2M3LCA0MXB4IDAgMCAtMTJweCAjYzdjN2M3LCA0MnB4IDAgMCAtMTJweCAjYzdjN2M3LCA0M3B4IDAgMCAtMTJweCAjYzdjN2M3LCA0NHB4IDAgMCAtMTJweCAjYzdjN2M3LCA0NXB4IDAgMCAtMTJweCAjYzdjN2M3LCA0NnB4IDAgMCAtMTJweCAjYzdjN2M3LCA0N3B4IDAgMCAtMTJweCAjYzdjN2M3LCA0OHB4IDAgMCAtMTJweCAjYzdjN2M3LCA0OXB4IDAgMCAtMTJweCAjYzdjN2M3LCA1MHB4IDAgMCAtMTJweCAjYzdjN2M3LCA1MXB4IDAgMCAtMTJweCAjYzdjN2M3LCA1MnB4IDAgMCAtMTJweCAjYzdjN2M3LCA1M3B4IDAgMCAtMTJweCAjYzdjN2M3LCA1NHB4IDAgMCAtMTJweCAjYzdjN2M3LCA1NXB4IDAgMCAtMTJweCAjYzdjN2M3LCA1NnB4IDAgMCAtMTJweCAjYzdjN2M3LCA1N3B4IDAgMCAtMTJweCAjYzdjN2M3LCA1OHB4IDAgMCAtMTJweCAjYzdjN2M3LCA1OXB4IDAgMCAtMTJweCAjYzdjN2M3LCA2MHB4IDAgMCAtMTJweCAjYzdjN2M3LCA2MXB4IDAgMCAtMTJweCAjYzdjN2M3LCA2MnB4IDAgMCAtMTJweCAjYzdjN2M3LCA2M3B4IDAgMCAtMTJweCAjYzdjN2M3LCA2NHB4IDAgMCAtMTJweCAjYzdjN2M3LCA2NXB4IDAgMCAtMTJweCAjYzdjN2M3LCA2NnB4IDAgMCAtMTJweCAjYzdjN2M3LCA2N3B4IDAgMCAtMTJweCAjYzdjN2M3LCA2OHB4IDAgMCAtMTJweCAjYzdjN2M3LCA2OXB4IDAgMCAtMTJweCAjYzdjN2M3LCA3MHB4IDAgMCAtMTJweCAjYzdjN2M3LCA3MXB4IDAgMCAtMTJweCAjYzdjN2M3LCA3MnB4IDAgMCAtMTJweCAjYzdjN2M3LCA3M3B4IDAgMCAtMTJweCAjYzdjN2M3LCA3NHB4IDAgMCAtMTJweCAjYzdjN2M3LCA3NXB4IDAgMCAtMTJweCAjYzdjN2M3LCA3NnB4IDAgMCAtMTJweCAjYzdjN2M3LCA3N3B4IDAgMCAtMTJweCAjYzdjN2M3LCA3OHB4IDAgMCAtMTJweCAjYzdjN2M3LCA3OXB4IDAgMCAtMTJweCAjYzdjN2M3LCA4MHB4IDAgMCAtMTJweCAjYzdjN2M3LCA4MXB4IDAgMCAtMTJweCAjYzdjN2M3LCA4MnB4IDAgMCAtMTJweCAjYzdjN2M3LCA4M3B4IDAgMCAtMTJweCAjYzdjN2M3LCA4NHB4IDAgMCAtMTJweCAjYzdjN2M3LCA4NXB4IDAgMCAtMTJweCAjYzdjN2M3LCA4NnB4IDAgMCAtMTJweCAjYzdjN2M3LCA4N3B4IDAgMCAtMTJweCAjYzdjN2M3LCA4OHB4IDAgMCAtMTJweCAjYzdjN2M3LCA4OXB4IDAgMCAtMTJweCAjYzdjN2M3LCA5MHB4IDAgMCAtMTJweCAjYzdjN2M3LCA5MXB4IDAgMCAtMTJweCAjYzdjN2M3LCA5MnB4IDAgMCAtMTJweCAjYzdjN2M3LCA5M3B4IDAgMCAtMTJweCAjYzdjN2M3LCA5NHB4IDAgMCAtMTJweCAjYzdjN2M3LCA5NXB4IDAgMCAtMTJweCAjYzdjN2M3LCA5NnB4IDAgMCAtMTJweCAjYzdjN2M3LCA5N3B4IDAgMCAtMTJweCAjYzdjN2M3LCA5OHB4IDAgMCAtMTJweCAjYzdjN2M3LCA5OXB4IDAgMCAtMTJweCAjYzdjN2M3LCAxMDBweCAwIDAgLTEycHggI2M3YzdjNywgMTAxcHggMCAwIC0xMnB4ICNjN2M3YzcsIDEwMnB4IDAgMCAtMTJweCAjYzdjN2M3LCAxMDNweCAwIDAgLTEycHggI2M3YzdjNywgMTA0cHggMCAwIC0xMnB4ICNjN2M3YzcsIDEwNXB4IDAgMCAtMTJweCAjYzdjN2M3LCAxMDZweCAwIDAgLTEycHggI2M3YzdjNywgMTA3cHggMCAwIC0xMnB4ICNjN2M3YzcsIDEwOHB4IDAgMCAtMTJweCAjYzdjN2M3LCAxMDlweCAwIDAgLTEycHggI2M3YzdjNywgMTEwcHggMCAwIC0xMnB4ICNjN2M3YzcsIDExMXB4IDAgMCAtMTJweCAjYzdjN2M3LCAxMTJweCAwIDAgLTEycHggI2M3YzdjNywgMTEzcHggMCAwIC0xMnB4ICNjN2M3YzcsIDExNHB4IDAgMCAtMTJweCAjYzdjN2M3LCAxMTVweCAwIDAgLTEycHggI2M3YzdjNywgMTE2cHggMCAwIC0xMnB4ICNjN2M3YzcsIDExN3B4IDAgMCAtMTJweCAjYzdjN2M3LCAxMThweCAwIDAgLTEycHggI2M3YzdjNywgMTE5cHggMCAwIC0xMnB4ICNjN2M3YzcsIDEyMHB4IDAgMCAtMTJweCAjYzdjN2M3LCAxMjFweCAwIDAgLTEycHggI2M3YzdjNywgMTIycHggMCAwIC0xMnB4ICNjN2M3YzcsIDEyM3B4IDAgMCAtMTJweCAjYzdjN2M3LCAxMjRweCAwIDAgLTEycHggI2M3YzdjNywgMTI1cHggMCAwIC0xMnB4ICNjN2M3YzcsIDEyNnB4IDAgMCAtMTJweCAjYzdjN2M3LCAxMjdweCAwIDAgLTEycHggI2M3YzdjNywgMTI4cHggMCAwIC0xMnB4ICNjN2M3YzcsIDEyOXB4IDAgMCAtMTJweCAjYzdjN2M3LCAxMzBweCAwIDAgLTEycHggI2M3YzdjNywgMTMxcHggMCAwIC0xMnB4ICNjN2M3YzcsIDEzMnB4IDAgMCAtMTJweCAjYzdjN2M3LCAxMzNweCAwIDAgLTEycHggI2M3YzdjNywgMTM0cHggMCAwIC0xMnB4ICNjN2M3YzcsIDEzNXB4IDAgMCAtMTJweCAjYzdjN2M3LCAxMzZweCAwIDAgLTEycHggI2M3YzdjNywgMTM3cHggMCAwIC0xMnB4ICNjN2M3YzcsIDEzOHB4IDAgMCAtMTJweCAjYzdjN2M3LCAxMzlweCAwIDAgLTEycHggI2M3YzdjNywgMTQwcHggMCAwIC0xMnB4ICNjN2M3YzcsIDE0MXB4IDAgMCAtMTJweCAjYzdjN2M3LCAxNDJweCAwIDAgLTEycHggI2M3YzdjNywgMTQzcHggMCAwIC0xMnB4ICNjN2M3YzcsIDE0NHB4IDAgMCAtMTJweCAjYzdjN2M3LCAxNDVweCAwIDAgLTEycHggI2M3YzdjNywgMTQ2cHggMCAwIC0xMnB4ICNjN2M3YzcsIDE0N3B4IDAgMCAtMTJweCAjYzdjN2M3LCAxNDhweCAwIDAgLTEycHggI2M3YzdjNywgMTQ5cHggMCAwIC0xMnB4ICNjN2M3YzcsIDE1MHB4IDAgMCAtMTJweCAjYzdjN2M3LCAxNTFweCAwIDAgLTEycHggI2M3YzdjNywgMTUycHggMCAwIC0xMnB4ICNjN2M3YzcsIDE1M3B4IDAgMCAtMTJweCAjYzdjN2M3LCAxNTRweCAwIDAgLTEycHggI2M3YzdjNywgMTU1cHggMCAwIC0xMnB4ICNjN2M3YzcsIDE1NnB4IDAgMCAtMTJweCAjYzdjN2M3LCAxNTdweCAwIDAgLTEycHggI2M3YzdjNywgMTU4cHggMCAwIC0xMnB4ICNjN2M3YzcsIDE1OXB4IDAgMCAtMTJweCAjYzdjN2M3LCAxNjBweCAwIDAgLTEycHggI2M3YzdjNywgMTYxcHggMCAwIC0xMnB4ICNjN2M3YzcsIDE2MnB4IDAgMCAtMTJweCAjYzdjN2M3LCAxNjNweCAwIDAgLTEycHggI2M3YzdjNywgMTY0cHggMCAwIC0xMnB4ICNjN2M3YzcsIDE2NXB4IDAgMCAtMTJweCAjYzdjN2M3LCAxNjZweCAwIDAgLTEycHggI2M3YzdjNywgMTY3cHggMCAwIC0xMnB4ICNjN2M3YzcsIDE2OHB4IDAgMCAtMTJweCAjYzdjN2M3LCAxNjlweCAwIDAgLTEycHggI2M3YzdjNywgMTcwcHggMCAwIC0xMnB4ICNjN2M3YzcsIDE3MXB4IDAgMCAtMTJweCAjYzdjN2M3LCAxNzJweCAwIDAgLTEycHggI2M3YzdjNywgMTczcHggMCAwIC0xMnB4ICNjN2M3YzcsIDE3NHB4IDAgMCAtMTJweCAjYzdjN2M3LCAxNzVweCAwIDAgLTEycHggI2M3YzdjNywgMTc2cHggMCAwIC0xMnB4ICNjN2M3YzcsIDE3N3B4IDAgMCAtMTJweCAjYzdjN2M3LCAxNzhweCAwIDAgLTEycHggI2M3YzdjNywgMTc5cHggMCAwIC0xMnB4ICNjN2M3YzcsIDE4MHB4IDAgMCAtMTJweCAjYzdjN2M3LCAxODFweCAwIDAgLTEycHggI2M3YzdjNywgMTgycHggMCAwIC0xMnB4ICNjN2M3YzcsIDE4M3B4IDAgMCAtMTJweCAjYzdjN2M3LCAxODRweCAwIDAgLTEycHggI2M3YzdjNywgMTg1cHggMCAwIC0xMnB4ICNjN2M3YzcsIDE4NnB4IDAgMCAtMTJweCAjYzdjN2M3LCAxODdweCAwIDAgLTEycHggI2M3YzdjNywgMTg4cHggMCAwIC0xMnB4ICNjN2M3YzcsIDE4OXB4IDAgMCAtMTJweCAjYzdjN2M3LCAxOTBweCAwIDAgLTEycHggI2M3YzdjNywgMTkxcHggMCAwIC0xMnB4ICNjN2M3YzcsIDE5MnB4IDAgMCAtMTJweCAjYzdjN2M3LCAxOTNweCAwIDAgLTEycHggI2M3YzdjNywgMTk0cHggMCAwIC0xMnB4ICNjN2M3YzcsIDE5NXB4IDAgMCAtMTJweCAjYzdjN2M3LCAxOTZweCAwIDAgLTEycHggI2M3YzdjNywgMTk3cHggMCAwIC0xMnB4ICNjN2M3YzcsIDE5OHB4IDAgMCAtMTJweCAjYzdjN2M3LCAxOTlweCAwIDAgLTEycHggI2M3YzdjNywgMjAwcHggMCAwIC0xMnB4ICNjN2M3YzcsIDIwMXB4IDAgMCAtMTJweCAjYzdjN2M3LCAyMDJweCAwIDAgLTEycHggI2M3YzdjNywgMjAzcHggMCAwIC0xMnB4ICNjN2M3YzcsIDIwNHB4IDAgMCAtMTJweCAjYzdjN2M3LCAyMDVweCAwIDAgLTEycHggI2M3YzdjNywgMjA2cHggMCAwIC0xMnB4ICNjN2M3YzcsIDIwN3B4IDAgMCAtMTJweCAjYzdjN2M3LCAyMDhweCAwIDAgLTEycHggI2M3YzdjNywgMjA5cHggMCAwIC0xMnB4ICNjN2M3YzcsIDIxMHB4IDAgMCAtMTJweCAjYzdjN2M3LCAyMTFweCAwIDAgLTEycHggI2M3YzdjNywgMjEycHggMCAwIC0xMnB4ICNjN2M3YzcsIDIxM3B4IDAgMCAtMTJweCAjYzdjN2M3LCAyMTRweCAwIDAgLTEycHggI2M3YzdjNywgMjE1cHggMCAwIC0xMnB4ICNjN2M3YzcsIDIxNnB4IDAgMCAtMTJweCAjYzdjN2M3LCAyMTdweCAwIDAgLTEycHggI2M3YzdjNywgMjE4cHggMCAwIC0xMnB4ICNjN2M3YzcsIDIxOXB4IDAgMCAtMTJweCAjYzdjN2M3LCAyMjBweCAwIDAgLTEycHggI2M3YzdjNywgMjIxcHggMCAwIC0xMnB4ICNjN2M3YzcsIDIyMnB4IDAgMCAtMTJweCAjYzdjN2M3LCAyMjNweCAwIDAgLTEycHggI2M3YzdjNywgMjI0cHggMCAwIC0xMnB4ICNjN2M3YzcsIDIyNXB4IDAgMCAtMTJweCAjYzdjN2M3LCAyMjZweCAwIDAgLTEycHggI2M3YzdjNywgMjI3cHggMCAwIC0xMnB4ICNjN2M3YzcsIDIyOHB4IDAgMCAtMTJweCAjYzdjN2M3LCAyMjlweCAwIDAgLTEycHggI2M3YzdjNywgMjMwcHggMCAwIC0xMnB4ICNjN2M3YzcsIDIzMXB4IDAgMCAtMTJweCAjYzdjN2M3LCAyMzJweCAwIDAgLTEycHggI2M3YzdjNywgMjMzcHggMCAwIC0xMnB4ICNjN2M3YzcsIDIzNHB4IDAgMCAtMTJweCAjYzdjN2M3LCAyMzVweCAwIDAgLTEycHggI2M3YzdjNywgMjM2cHggMCAwIC0xMnB4ICNjN2M3YzcsIDIzN3B4IDAgMCAtMTJweCAjYzdjN2M3LCAyMzhweCAwIDAgLTEycHggI2M3YzdjNywgMjM5cHggMCAwIC0xMnB4ICNjN2M3YzcsIDI0MHB4IDAgMCAtMTJweCAjYzdjN2M3LCAyNDFweCAwIDAgLTEycHggI2M3YzdjNywgMjQycHggMCAwIC0xMnB4ICNjN2M3YzcsIDI0M3B4IDAgMCAtMTJweCAjYzdjN2M3LCAyNDRweCAwIDAgLTEycHggI2M3YzdjNywgMjQ1cHggMCAwIC0xMnB4ICNjN2M3YzcsIDI0NnB4IDAgMCAtMTJweCAjYzdjN2M3LCAyNDdweCAwIDAgLTEycHggI2M3YzdjNywgMjQ4cHggMCAwIC0xMnB4ICNjN2M3YzcsIDI0OXB4IDAgMCAtMTJweCAjYzdjN2M3LCAyNTBweCAwIDAgLTEycHggI2M3YzdjNywgMjUxcHggMCAwIC0xMnB4ICNjN2M3YzcsIDI1MnB4IDAgMCAtMTJweCAjYzdjN2M3LCAyNTNweCAwIDAgLTEycHggI2M3YzdjNywgMjU0cHggMCAwIC0xMnB4ICNjN2M3YzcsIDI1NXB4IDAgMCAtMTJweCAjYzdjN2M3LCAyNTZweCAwIDAgLTEycHggI2M3YzdjNywgMjU3cHggMCAwIC0xMnB4ICNjN2M3YzcsIDI1OHB4IDAgMCAtMTJweCAjYzdjN2M3LCAyNTlweCAwIDAgLTEycHggI2M3YzdjNywgMjYwcHggMCAwIC0xMnB4ICNjN2M3YzcsIDI2MXB4IDAgMCAtMTJweCAjYzdjN2M3LCAyNjJweCAwIDAgLTEycHggI2M3YzdjNywgMjYzcHggMCAwIC0xMnB4ICNjN2M3YzcsIDI2NHB4IDAgMCAtMTJweCAjYzdjN2M3LCAyNjVweCAwIDAgLTEycHggI2M3YzdjNywgMjY2cHggMCAwIC0xMnB4ICNjN2M3YzcsIDI2N3B4IDAgMCAtMTJweCAjYzdjN2M3LCAyNjhweCAwIDAgLTEycHggI2M3YzdjNywgMjY5cHggMCAwIC0xMnB4ICNjN2M3YzcsIDI3MHB4IDAgMCAtMTJweCAjYzdjN2M3LCAyNzFweCAwIDAgLTEycHggI2M3YzdjNywgMjcycHggMCAwIC0xMnB4ICNjN2M3YzcsIDI3M3B4IDAgMCAtMTJweCAjYzdjN2M3LCAyNzRweCAwIDAgLTEycHggI2M3YzdjNywgMjc1cHggMCAwIC0xMnB4ICNjN2M3YzcsIDI3NnB4IDAgMCAtMTJweCAjYzdjN2M3LCAyNzdweCAwIDAgLTEycHggI2M3YzdjNywgMjc4cHggMCAwIC0xMnB4ICNjN2M3YzcsIDI3OXB4IDAgMCAtMTJweCAjYzdjN2M3LCAyODBweCAwIDAgLTEycHggI2M3YzdjNywgMjgxcHggMCAwIC0xMnB4ICNjN2M3YzcsIDI4MnB4IDAgMCAtMTJweCAjYzdjN2M3LCAyODNweCAwIDAgLTEycHggI2M3YzdjNywgMjg0cHggMCAwIC0xMnB4ICNjN2M3YzcsIDI4NXB4IDAgMCAtMTJweCAjYzdjN2M3LCAyODZweCAwIDAgLTEycHggI2M3YzdjNywgMjg3cHggMCAwIC0xMnB4ICNjN2M3YzcsIDI4OHB4IDAgMCAtMTJweCAjYzdjN2M3LCAyODlweCAwIDAgLTEycHggI2M3YzdjNywgMjkwcHggMCAwIC0xMnB4ICNjN2M3YzcsIDI5MXB4IDAgMCAtMTJweCAjYzdjN2M3LCAyOTJweCAwIDAgLTEycHggI2M3YzdjNywgMjkzcHggMCAwIC0xMnB4ICNjN2M3YzcsIDI5NHB4IDAgMCAtMTJweCAjYzdjN2M3LCAyOTVweCAwIDAgLTEycHggI2M3YzdjNywgMjk2cHggMCAwIC0xMnB4ICNjN2M3YzcsIDI5N3B4IDAgMCAtMTJweCAjYzdjN2M3LCAyOThweCAwIDAgLTEycHggI2M3YzdjNywgMjk5cHggMCAwIC0xMnB4ICNjN2M3YzcsIDMwMHB4IDAgMCAtMTJweCAjYzdjN2M3LCAzMDFweCAwIDAgLTEycHggI2M3YzdjNywgMzAycHggMCAwIC0xMnB4ICNjN2M3YzcsIDMwM3B4IDAgMCAtMTJweCAjYzdjN2M3LCAzMDRweCAwIDAgLTEycHggI2M3YzdjNywgMzA1cHggMCAwIC0xMnB4ICNjN2M3YzcsIDMwNnB4IDAgMCAtMTJweCAjYzdjN2M3LCAzMDdweCAwIDAgLTEycHggI2M3YzdjNywgMzA4cHggMCAwIC0xMnB4ICNjN2M3YzcsIDMwOXB4IDAgMCAtMTJweCAjYzdjN2M3LCAzMTBweCAwIDAgLTEycHggI2M3YzdjNywgMzExcHggMCAwIC0xMnB4ICNjN2M3YzcsIDMxMnB4IDAgMCAtMTJweCAjYzdjN2M3LCAzMTNweCAwIDAgLTEycHggI2M3YzdjNywgMzE0cHggMCAwIC0xMnB4ICNjN2M3YzcsIDMxNXB4IDAgMCAtMTJweCAjYzdjN2M3LCAzMTZweCAwIDAgLTEycHggI2M3YzdjNywgMzE3cHggMCAwIC0xMnB4ICNjN2M3YzcsIDMxOHB4IDAgMCAtMTJweCAjYzdjN2M3LCAzMTlweCAwIDAgLTEycHggI2M3YzdjNywgMzIwcHggMCAwIC0xMnB4ICNjN2M3YzcsIDMyMXB4IDAgMCAtMTJweCAjYzdjN2M3LCAzMjJweCAwIDAgLTEycHggI2M3YzdjNywgMzIzcHggMCAwIC0xMnB4ICNjN2M3YzcsIDMyNHB4IDAgMCAtMTJweCAjYzdjN2M3LCAzMjVweCAwIDAgLTEycHggI2M3YzdjNywgMzI2cHggMCAwIC0xMnB4ICNjN2M3YzcsIDMyN3B4IDAgMCAtMTJweCAjYzdjN2M3LCAzMjhweCAwIDAgLTEycHggI2M3YzdjNywgMzI5cHggMCAwIC0xMnB4ICNjN2M3YzcsIDMzMHB4IDAgMCAtMTJweCAjYzdjN2M3LCAzMzFweCAwIDAgLTEycHggI2M3YzdjNywgMzMycHggMCAwIC0xMnB4ICNjN2M3YzcsIDMzM3B4IDAgMCAtMTJweCAjYzdjN2M3LCAzMzRweCAwIDAgLTEycHggI2M3YzdjNywgMzM1cHggMCAwIC0xMnB4ICNjN2M3YzcsIDMzNnB4IDAgMCAtMTJweCAjYzdjN2M3LCAzMzdweCAwIDAgLTEycHggI2M3YzdjNywgMzM4cHggMCAwIC0xMnB4ICNjN2M3YzcsIDMzOXB4IDAgMCAtMTJweCAjYzdjN2M3LCAzNDBweCAwIDAgLTEycHggI2M3YzdjNywgMzQxcHggMCAwIC0xMnB4ICNjN2M3YzcsIDM0MnB4IDAgMCAtMTJweCAjYzdjN2M3LCAzNDNweCAwIDAgLTEycHggI2M3YzdjNywgMzQ0cHggMCAwIC0xMnB4ICNjN2M3YzcsIDM0NXB4IDAgMCAtMTJweCAjYzdjN2M3LCAzNDZweCAwIDAgLTEycHggI2M3YzdjNywgMzQ3cHggMCAwIC0xMnB4ICNjN2M3YzcsIDM0OHB4IDAgMCAtMTJweCAjYzdjN2M3LCAzNDlweCAwIDAgLTEycHggI2M3YzdjNywgMzUwcHggMCAwIC0xMnB4ICNjN2M3YzcsIDBweCAwIDAgLTEwcHggI2M3YzdjNztcXG59XFxuI3VzZXIge1xcbiAgbWFyZ2luLXRvcDogNTBweDtcXG59XFxuLnVzZXItY2FyZCB7XFxuICB3aWR0aDogNjQwcHg7XFxuICBoZWlnaHQ6IDIwMHB4O1xcbiAgcGFkZGluZzogMCAzMHB4O1xcbiAgYm9yZGVyOiAzcHggc29saWQgI0Q5RTNGMDtcXG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICBkaXNwbGF5OiBmbGV4O1xcbn1cXG4udXNlci1jYXJkIC50aHVtYiB7XFxuICBoZWlnaHQ6IDE0MHB4O1xcbiAgbWFyZ2luOiAzMHB4IDA7XFxufVxcbi51c2VyLWNhcmQgLnRodW1iIGltZyB7XFxuICBoZWlnaHQ6IDEyMHB4O1xcbiAgd2lkdGg6IDEyMHB4O1xcbiAgYm9yZGVyOiAycHggc29saWQgI0Q5RTNGMDtcXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcXG4gIHBhZGRpbmc6IDEwcHg7XFxuICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC41cyBlYXNlLWluLW91dDtcXG59XFxuLnVzZXItY2FyZCAudGh1bWIgaW1nOmhvdmVyIHtcXG4gIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XFxufVxcbi51c2VyLWNhcmQgLmluZm8ge1xcbiAgZmxleC1ncm93OiA3O1xcbiAgbWFyZ2luOiA1MHB4IDIwcHg7XFxufVxcbi51c2VyLWNhcmQgLmluZm8gcCB7XFxuICBtYXJnaW46IDEwcHg7XFxufVxcbi51c2VyLWNhcmQgLmluZm8gLnRpdGxlIHtcXG4gIGZvbnQtc2l6ZTogMzBweDtcXG4gIGZvbnQtd2VpZ2h0OiA5MDA7XFxuICBjb2xvcjogIzY5NzY4OTtcXG59XFxuLnVzZXItY2FyZCAuaW5mbyAuc3VidGl0bGUge1xcbiAgZm9udC1zaXplOiAyNnB4O1xcbiAgY29sb3I6ICM2OTc2ODk7XFxufVxcbi51c2VyLWNhcmQgLmFjdGlvbiB7XFxuICB0ZXh0LWFsaWduOiByaWdodDtcXG4gIG1hcmdpbjogNjBweCAyMHB4O1xcbiAgaGVpZ2h0OiA4MHB4O1xcbiAgd2lkdGg6IDgwcHg7XFxuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xcbiAgYmFja2dyb3VuZC1zaXplOiAxMDAlIDEwMCU7XFxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIgKyBlc2NhcGUocmVxdWlyZShcIi4uL2ltYWdlcy9hZGQucG5nXCIpKSArIFwiKTtcXG59XFxuLnVzZXItY2FyZCAuYWN0aW9uOmhvdmVyIHtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IHVybChcIiArIGVzY2FwZShyZXF1aXJlKFwiLi4vaW1hZ2VzL2FkZC1ob3Zlci5wbmdcIikpICsgXCIpO1xcbn1cXG4jdmlkZW8tYm94IHtcXG4gIG1hcmdpbi1sZWZ0OiA1MHB4O1xcbn1cXG4udmlkZW8ge1xcbiAgd2lkdGg6IDU2MHB4O1xcbiAgaGVpZ2h0OiAzMDBweDtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIG1hcmdpbi1sZWZ0OiA1MHB4O1xcbiAgYm9yZGVyOiAzcHggc29saWQgI0Q5RTNGMDtcXG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XFxufVxcbi52aWRlbyAudmlkZW8tdmlkZW8ge1xcbiAgb2JqZWN0LWZpdDogZmlsbDtcXG4gIHdpZHRoOiA1MzBweDtcXG4gIGhlaWdodDogMzUwb3g7XFxufVxcbi52aWRlbyAuY29udHJvbCB7XFxuICBoZWlnaHQ6IDExMHB4O1xcbiAgd2lkdGg6IDEwMCU7XFxuICBiYWNrZ3JvdW5kOiAjRDlFM0YwO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYm90dG9tOiAwO1xcbiAgZGlzcGxheTogZmxleDtcXG59XFxuLnZpZGVvIC5jb250cm9sIC5jb250cm9sX19zdGFydCB7XFxuICBtYXJnaW46IDI1cHggMjBweDtcXG4gIGhlaWdodDogNjBweDtcXG4gIHdpZHRoOiA2MHB4O1xcbiAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXG4gIGJhY2tncm91bmQ6IHVybChcIiArIGVzY2FwZShyZXF1aXJlKFwiLi4vaW1hZ2VzL3N0YXJ0LnBuZ1wiKSkgKyBcIik7XFxuICBiYWNrZ3JvdW5kLXNpemU6IDEwMCUgMTAwJTtcXG59XFxuLnZpZGVvIC5jb250cm9sIC5yYW5nZXIge1xcbiAgYmFja2dyb3VuZDogbm9uZTtcXG59XFxuI3RhYmxlIHtcXG4gIG1hcmdpbi10b3A6IDUwcHg7XFxufVxcbi5saW5lVGFibGUge1xcbiAgYm9yZGVyOiAzcHggc29saWQgI0Q5RTNGMDtcXG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XFxuICBwYWRkaW5nOiAxMHB4IDMwcHg7XFxufVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcbiIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1c2VTb3VyY2VNYXApIHtcblx0dmFyIGxpc3QgPSBbXTtcblxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBjb250ZW50ICsgXCJ9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcblx0XHRcdH1cblx0XHR9KS5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG5cdHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblx0aWYgKCFjc3NNYXBwaW5nKSB7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cblxuXHRpZiAodXNlU291cmNlTWFwICYmIHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG5cdFx0dmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0XHRcdHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLydcblx0XHR9KTtcblxuXHRcdHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcblx0dmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSk7XG5cdHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG5cblx0cmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXNjYXBlKHVybCkge1xuICAgIGlmICh0eXBlb2YgdXJsICE9PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4gdXJsXG4gICAgfVxuICAgIC8vIElmIHVybCBpcyBhbHJlYWR5IHdyYXBwZWQgaW4gcXVvdGVzLCByZW1vdmUgdGhlbVxuICAgIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgICAgICB1cmwgPSB1cmwuc2xpY2UoMSwgLTEpO1xuICAgIH1cbiAgICAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gICAgLy8gU2VlIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtdmFsdWVzLTMvI3VybHNcbiAgICBpZiAoL1tcIicoKSBcXHRcXG5dLy50ZXN0KHVybCkpIHtcbiAgICAgICAgcmV0dXJuICdcIicgKyB1cmwucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpLnJlcGxhY2UoL1xcbi9nLCAnXFxcXG4nKSArICdcIidcbiAgICB9XG5cbiAgICByZXR1cm4gdXJsXG59XG4iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuXG52YXIgc3R5bGVzSW5Eb20gPSB7fTtcblxudmFyXHRtZW1vaXplID0gZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRyZXR1cm4gbWVtbztcblx0fTtcbn07XG5cbnZhciBpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbiAoKSB7XG5cdC8vIFRlc3QgZm9yIElFIDw9IDkgYXMgcHJvcG9zZWQgYnkgQnJvd3NlcmhhY2tzXG5cdC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcblx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlclxuXHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0Ly8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG5cdHJldHVybiB3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYjtcbn0pO1xuXG52YXIgZ2V0VGFyZ2V0ID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xufTtcblxudmFyIGdldEVsZW1lbnQgPSAoZnVuY3Rpb24gKGZuKSB7XG5cdHZhciBtZW1vID0ge307XG5cblx0cmV0dXJuIGZ1bmN0aW9uKHRhcmdldCkge1xuICAgICAgICAgICAgICAgIC8vIElmIHBhc3NpbmcgZnVuY3Rpb24gaW4gb3B0aW9ucywgdGhlbiB1c2UgaXQgZm9yIHJlc29sdmUgXCJoZWFkXCIgZWxlbWVudC5cbiAgICAgICAgICAgICAgICAvLyBVc2VmdWwgZm9yIFNoYWRvdyBSb290IHN0eWxlIGkuZVxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgIGluc2VydEludG86IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjZm9vXCIpLnNoYWRvd1Jvb3QgfVxuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRhcmdldCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0dmFyIHN0eWxlVGFyZ2V0ID0gZ2V0VGFyZ2V0LmNhbGwodGhpcywgdGFyZ2V0KTtcblx0XHRcdC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG5cdFx0XHRpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0Ly8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcblx0XHRcdFx0XHQvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuXHRcdFx0XHRcdHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG5cdFx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHRcdHN0eWxlVGFyZ2V0ID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG5cdFx0fVxuXHRcdHJldHVybiBtZW1vW3RhcmdldF1cblx0fTtcbn0pKCk7XG5cbnZhciBzaW5nbGV0b24gPSBudWxsO1xudmFyXHRzaW5nbGV0b25Db3VudGVyID0gMDtcbnZhclx0c3R5bGVzSW5zZXJ0ZWRBdFRvcCA9IFtdO1xuXG52YXJcdGZpeFVybHMgPSByZXF1aXJlKFwiLi91cmxzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcblx0aWYgKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xuXHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcblx0fVxuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG5cdG9wdGlvbnMuYXR0cnMgPSB0eXBlb2Ygb3B0aW9ucy5hdHRycyA9PT0gXCJvYmplY3RcIiA/IG9wdGlvbnMuYXR0cnMgOiB7fTtcblxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAoIW9wdGlvbnMuc2luZ2xldG9uICYmIHR5cGVvZiBvcHRpb25zLnNpbmdsZXRvbiAhPT0gXCJib29sZWFuXCIpIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIDxoZWFkPiBlbGVtZW50XG4gICAgICAgIGlmICghb3B0aW9ucy5pbnNlcnRJbnRvKSBvcHRpb25zLmluc2VydEludG8gPSBcImhlYWRcIjtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhcmdldFxuXHRpZiAoIW9wdGlvbnMuaW5zZXJ0QXQpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucyk7XG5cblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlIChuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcblx0XHR9XG5cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QsIG9wdGlvbnMpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvciAodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIGRvbVN0eWxlLnBhcnRzW2pdKCk7XG5cblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbSAoc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblxuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMgKGxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pIHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZSBuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQgKG9wdGlvbnMsIHN0eWxlKSB7XG5cdHZhciB0YXJnZXQgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50bylcblxuXHRpZiAoIXRhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0SW50bycgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuXHR9XG5cblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVzSW5zZXJ0ZWRBdFRvcFtzdHlsZXNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYgKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgdGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZiAobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdHRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGUsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0XHR9XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlKTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0dGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcblx0fSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJvYmplY3RcIiAmJiBvcHRpb25zLmluc2VydEF0LmJlZm9yZSkge1xuXHRcdHZhciBuZXh0U2libGluZyA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvICsgXCIgXCIgKyBvcHRpb25zLmluc2VydEF0LmJlZm9yZSk7XG5cdFx0dGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZSwgbmV4dFNpYmxpbmcpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIltTdHlsZSBMb2FkZXJdXFxuXFxuIEludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnICgnb3B0aW9ucy5pbnNlcnRBdCcpIGZvdW5kLlxcbiBNdXN0IGJlICd0b3AnLCAnYm90dG9tJywgb3IgT2JqZWN0LlxcbiAoaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIjaW5zZXJ0YXQpXFxuXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudCAoc3R5bGUpIHtcblx0aWYgKHN0eWxlLnBhcmVudE5vZGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblx0c3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZSk7XG5cblx0dmFyIGlkeCA9IHN0eWxlc0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZSk7XG5cdGlmKGlkeCA+PSAwKSB7XG5cdFx0c3R5bGVzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXG5cdGlmKG9wdGlvbnMuYXR0cnMudHlwZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHR9XG5cblx0YWRkQXR0cnMoc3R5bGUsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGUpO1xuXG5cdHJldHVybiBzdHlsZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQgKG9wdGlvbnMpIHtcblx0dmFyIGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblxuXHRpZihvcHRpb25zLmF0dHJzLnR5cGUgPT09IHVuZGVmaW5lZCkge1xuXHRcdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0fVxuXHRvcHRpb25zLmF0dHJzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXG5cdGFkZEF0dHJzKGxpbmssIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGluayk7XG5cblx0cmV0dXJuIGxpbms7XG59XG5cbmZ1bmN0aW9uIGFkZEF0dHJzIChlbCwgYXR0cnMpIHtcblx0T2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUgKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGUsIHVwZGF0ZSwgcmVtb3ZlLCByZXN1bHQ7XG5cblx0Ly8gSWYgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gd2FzIGRlZmluZWQsIHJ1biBpdCBvbiB0aGUgY3NzXG5cdGlmIChvcHRpb25zLnRyYW5zZm9ybSAmJiBvYmouY3NzKSB7XG5cdCAgICByZXN1bHQgPSBvcHRpb25zLnRyYW5zZm9ybShvYmouY3NzKTtcblxuXHQgICAgaWYgKHJlc3VsdCkge1xuXHQgICAgXHQvLyBJZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHZhbHVlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIHJ1bm5pbmcgcnVudGltZSB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIGNzcy5cblx0ICAgIFx0b2JqLmNzcyA9IHJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdC8vIElmIHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gcmV0dXJucyBhIGZhbHN5IHZhbHVlLCBkb24ndCBhZGQgdGhpcyBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIGNvbmRpdGlvbmFsIGxvYWRpbmcgb2YgY3NzXG5cdCAgICBcdHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIFx0XHQvLyBub29wXG5cdCAgICBcdH07XG5cdCAgICB9XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblxuXHRcdHN0eWxlID0gc2luZ2xldG9uIHx8IChzaW5nbGV0b24gPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlLCBzdHlsZUluZGV4LCB0cnVlKTtcblxuXHR9IGVsc2UgaWYgKFxuXHRcdG9iai5zb3VyY2VNYXAgJiZcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiXG5cdCkge1xuXHRcdHN0eWxlID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlLCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXG5cdFx0XHRpZihzdHlsZS5ocmVmKSBVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlLmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGUgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuXHRcdH07XG5cdH1cblxuXHR1cGRhdGUob2JqKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUgKG5ld09iaikge1xuXHRcdGlmIChuZXdPYmopIHtcblx0XHRcdGlmIChcblx0XHRcdFx0bmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJlxuXHRcdFx0XHRuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJlxuXHRcdFx0XHRuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwXG5cdFx0XHQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblx0fTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcgKHN0eWxlLCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xuXG5cdGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGUuY2hpbGROb2RlcztcblxuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGUucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRzdHlsZS5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZS5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyAoc3R5bGUsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGUuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXG5cdH1cblxuXHRpZihzdHlsZS5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlLmZpcnN0Q2hpbGQpIHtcblx0XHRcdHN0eWxlLnJlbW92ZUNoaWxkKHN0eWxlLmZpcnN0Q2hpbGQpO1xuXHRcdH1cblxuXHRcdHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsgKGxpbmssIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0Lypcblx0XHRJZiBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgaXNuJ3QgZGVmaW5lZCwgYnV0IHNvdXJjZW1hcHMgYXJlIGVuYWJsZWRcblx0XHRhbmQgdGhlcmUgaXMgbm8gcHVibGljUGF0aCBkZWZpbmVkIHRoZW4gbGV0cyB0dXJuIGNvbnZlcnRUb0Fic29sdXRlVXJsc1xuXHRcdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRcdGRpcmVjdGx5XG5cdCovXG5cdHZhciBhdXRvRml4VXJscyA9IG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzID09PSB1bmRlZmluZWQgJiYgc291cmNlTWFwO1xuXG5cdGlmIChvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyB8fCBhdXRvRml4VXJscykge1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmIChzb3VyY2VNYXApIHtcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcblx0fVxuXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xuXG5cdHZhciBvbGRTcmMgPSBsaW5rLmhyZWY7XG5cblx0bGluay5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpIFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cbiIsIlxuLyoqXG4gKiBXaGVuIHNvdXJjZSBtYXBzIGFyZSBlbmFibGVkLCBgc3R5bGUtbG9hZGVyYCB1c2VzIGEgbGluayBlbGVtZW50IHdpdGggYSBkYXRhLXVyaSB0b1xuICogZW1iZWQgdGhlIGNzcyBvbiB0aGUgcGFnZS4gVGhpcyBicmVha3MgYWxsIHJlbGF0aXZlIHVybHMgYmVjYXVzZSBub3cgdGhleSBhcmUgcmVsYXRpdmUgdG8gYVxuICogYnVuZGxlIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgcGFnZS5cbiAqXG4gKiBPbmUgc29sdXRpb24gaXMgdG8gb25seSB1c2UgZnVsbCB1cmxzLCBidXQgdGhhdCBtYXkgYmUgaW1wb3NzaWJsZS5cbiAqXG4gKiBJbnN0ZWFkLCB0aGlzIGZ1bmN0aW9uIFwiZml4ZXNcIiB0aGUgcmVsYXRpdmUgdXJscyB0byBiZSBhYnNvbHV0ZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgcGFnZSBsb2NhdGlvbi5cbiAqXG4gKiBBIHJ1ZGltZW50YXJ5IHRlc3Qgc3VpdGUgaXMgbG9jYXRlZCBhdCBgdGVzdC9maXhVcmxzLmpzYCBhbmQgY2FuIGJlIHJ1biB2aWEgdGhlIGBucG0gdGVzdGAgY29tbWFuZC5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gIC8vIGdldCBjdXJyZW50IGxvY2F0aW9uXG4gIHZhciBsb2NhdGlvbiA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmxvY2F0aW9uO1xuXG4gIGlmICghbG9jYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaXhVcmxzIHJlcXVpcmVzIHdpbmRvdy5sb2NhdGlvblwiKTtcbiAgfVxuXG5cdC8vIGJsYW5rIG9yIG51bGw/XG5cdGlmICghY3NzIHx8IHR5cGVvZiBjc3MgIT09IFwic3RyaW5nXCIpIHtcblx0ICByZXR1cm4gY3NzO1xuICB9XG5cbiAgdmFyIGJhc2VVcmwgPSBsb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIGxvY2F0aW9uLmhvc3Q7XG4gIHZhciBjdXJyZW50RGlyID0gYmFzZVVybCArIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL1teXFwvXSokLywgXCIvXCIpO1xuXG5cdC8vIGNvbnZlcnQgZWFjaCB1cmwoLi4uKVxuXHQvKlxuXHRUaGlzIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBqdXN0IGEgd2F5IHRvIHJlY3Vyc2l2ZWx5IG1hdGNoIGJyYWNrZXRzIHdpdGhpblxuXHRhIHN0cmluZy5cblxuXHQgL3VybFxccypcXCggID0gTWF0Y2ggb24gdGhlIHdvcmQgXCJ1cmxcIiB3aXRoIGFueSB3aGl0ZXNwYWNlIGFmdGVyIGl0IGFuZCB0aGVuIGEgcGFyZW5zXG5cdCAgICggID0gU3RhcnQgYSBjYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAoPzogID0gU3RhcnQgYSBub24tY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgICAgIFteKShdICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAoPzogID0gU3RhcnQgYW5vdGhlciBub24tY2FwdHVyaW5nIGdyb3Vwc1xuXHQgICAgICAgICAgICAgICAgIFteKShdKyAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICAgICAgW14pKF0qICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIFxcKSAgPSBNYXRjaCBhIGVuZCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKSAgPSBFbmQgR3JvdXBcbiAgICAgICAgICAgICAgKlxcKSA9IE1hdGNoIGFueXRoaW5nIGFuZCB0aGVuIGEgY2xvc2UgcGFyZW5zXG4gICAgICAgICAgKSAgPSBDbG9zZSBub24tY2FwdHVyaW5nIGdyb3VwXG4gICAgICAgICAgKiAgPSBNYXRjaCBhbnl0aGluZ1xuICAgICAgICkgID0gQ2xvc2UgY2FwdHVyaW5nIGdyb3VwXG5cdCBcXCkgID0gTWF0Y2ggYSBjbG9zZSBwYXJlbnNcblxuXHQgL2dpICA9IEdldCBhbGwgbWF0Y2hlcywgbm90IHRoZSBmaXJzdC4gIEJlIGNhc2UgaW5zZW5zaXRpdmUuXG5cdCAqL1xuXHR2YXIgZml4ZWRDc3MgPSBjc3MucmVwbGFjZSgvdXJsXFxzKlxcKCgoPzpbXikoXXxcXCgoPzpbXikoXSt8XFwoW14pKF0qXFwpKSpcXCkpKilcXCkvZ2ksIGZ1bmN0aW9uKGZ1bGxNYXRjaCwgb3JpZ1VybCkge1xuXHRcdC8vIHN0cmlwIHF1b3RlcyAoaWYgdGhleSBleGlzdClcblx0XHR2YXIgdW5xdW90ZWRPcmlnVXJsID0gb3JpZ1VybFxuXHRcdFx0LnRyaW0oKVxuXHRcdFx0LnJlcGxhY2UoL15cIiguKilcIiQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSlcblx0XHRcdC5yZXBsYWNlKC9eJyguKiknJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KTtcblxuXHRcdC8vIGFscmVhZHkgYSBmdWxsIHVybD8gbm8gY2hhbmdlXG5cdFx0aWYgKC9eKCN8ZGF0YTp8aHR0cDpcXC9cXC98aHR0cHM6XFwvXFwvfGZpbGU6XFwvXFwvXFwvfFxccyokKS9pLnRlc3QodW5xdW90ZWRPcmlnVXJsKSkge1xuXHRcdCAgcmV0dXJuIGZ1bGxNYXRjaDtcblx0XHR9XG5cblx0XHQvLyBjb252ZXJ0IHRoZSB1cmwgdG8gYSBmdWxsIHVybFxuXHRcdHZhciBuZXdVcmw7XG5cblx0XHRpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvL1wiKSA9PT0gMCkge1xuXHRcdCAgXHQvL1RPRE86IHNob3VsZCB3ZSBhZGQgcHJvdG9jb2w/XG5cdFx0XHRuZXdVcmwgPSB1bnF1b3RlZE9yaWdVcmw7XG5cdFx0fSBlbHNlIGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHVybFxuXHRcdFx0bmV3VXJsID0gYmFzZVVybCArIHVucXVvdGVkT3JpZ1VybDsgLy8gYWxyZWFkeSBzdGFydHMgd2l0aCAnLydcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gY3VycmVudCBkaXJlY3Rvcnlcblx0XHRcdG5ld1VybCA9IGN1cnJlbnREaXIgKyB1bnF1b3RlZE9yaWdVcmwucmVwbGFjZSgvXlxcLlxcLy8sIFwiXCIpOyAvLyBTdHJpcCBsZWFkaW5nICcuLydcblx0XHR9XG5cblx0XHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIHVybCguLi4pXG5cdFx0cmV0dXJuIFwidXJsKFwiICsgSlNPTi5zdHJpbmdpZnkobmV3VXJsKSArIFwiKVwiO1xuXHR9KTtcblxuXHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIGNzc1xuXHRyZXR1cm4gZml4ZWRDc3M7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBSUFBQUFDQUNBWUFBQUREUG1ITEFBQVd6VWxFUVZSNFh1MWRlNWdjVlpYL25lcVp2TU1yRzBLbXF5RkFJSm11VGtMUzFaamxwUUZremJvS1NBektRMUFVZFZmUjVTR3JpSXNLbWc4UThiRXFpanhXUkRRK0VCQkZRbkJSMlVoWFQ0QlVkWVozdEtzbkNSRkltRHdteVhRZHY5czlHV1ltUGQzM1ZsZjMxRFNwZitaTDZyenV1YisrZFIvbm5rTm93bWRXNTZiSmtlNmVkdElvemg3SE5TSUR3RUVBSmpCNG92aEx3QVF3VFFLeEIyQTdBOXNCYkNPUStDdisvWGN3WjBHVVJTU1NmYTNBVHBmWkp0NDExVU9qdmpYTVpLek96d1ZqRVR5Y0RNSThBZzROdWwwTU1JQy9FWGcxZ0VjTDNMcHliZW9RTzJnOWpaWTNLZ0V3ZS9YNkdTMkZ3bUlHVGlid0tRQWQyR2pIOWVsN0dZeEhXY05LS3RCdjdXT2p1Ukd5dzdmYVVRTUF3OGtkUkR0b0tRUG5FbkNDN3hiWGlWR01FTVQ4R0JQdTJvR0p5MTgwRDlwU0oxV0JpZzAzQUpnamNTdC9KZ0huRS9GaWdGb0RiWDJkaERGNEp4aS84U2p5bzdYSjZmZUJTTXd6UXZtRUV3RE1sT2pvV3Nyc1hVZWdJMFBwT1Ztam1GOEUwUTA5KzBkdmYvNG8yaW5MMWlpNjBBSEFTT2ZmRGZLK1NxQjRvNXpRRUQyTWpVejg5ZDVKNDc3enpPeXAzUTNSS2FFa05BQ1kwN0grclY2aGNETVJqcEd3ZTlTU01QUHJSTnFYN1dUYlRXSDROSXc0QU5xdFRkTTE5TnhJb0hOR2JhLzZNSndaVDVLbW5XTW4yOWI2WUErTVplUUE4Q2kzeENmblAwWEFOUVJNQ3F4Rm8wb1E3d2JqSzJOSnZ5NWowdTZSTUgxRUFOQ2VjUmRHUE53QndxeVJhSFRZZERLdzFvTjIzbHF6cmFQUnRqVVdBR0oybittNkRNeGZCYUdsZ1kzZHhJeG5pYkNaR2QwZzNncW1iaEMyTXZNNGpXZ3lHSk9ZZURLQjltZGdCb0REQ0dpWWY0cExSOUl1YzVMUi8ybWdYeHJYd0RsUGJ6N1EyOVY5RDRGT3ExY0RpNXN4d0JvR1ZvQ3dwa0I0cG5mWGVPZjVoVk5lVjlVNTR5VWVOKzRWOXlpTmFaYW1rUUdQVDJEaUV3azBWbFdXQ2owejd1dWRQUGE4UnEwVUdvSndNZVJyekw4azBIUVZaOGpRaWtNYllyNlBvYTNZR2RGV1BMOWcraVlaUGo4ME01L2pzV08zNUk4anhxa0Fud1lpMDQrY3Fqek1MM25RenNxbW91TGNvYTVQM1FGZ3BQUHZJL0NQZ2h6eUdmQUFYc0dnVzhjamV1OUlUYURhTzdvT0k4OWJvZ0ZMQUN3TXNxY1l2SXRCNTJWTmZYbVFjb2ZLcWlzQWpFenVJMkM2SmJodktXOWgwRGZKb3grRTdlQWw4VVEreGhwL0d1RC9DUFF6UWJqS1R1cGZxUmNJNmdZQXc4cC9nY0JmRE1ad3pudWdtelpEKzE3WXorUm5kV3hxYS9WMlhnM3dSWUdkWFREZlpwdjZ4U0FxQk9QUE42UUVEd0J4UHAvcHVvWEFId25BMkUxTWZKWHp1bjQ3RmxGdkFQSWFKc0t3dWc0RkNzc0k5UDVBbERKVzhJUXhaenJHd1ZzRGtkY25KSEFBSkN6M3V3QStWb3VSZmJQNVczcDZ4MS9wWndaZmkrNmdlZHM3dWs3U3ZNSnRBUjFxUFd3bm80dURIQWtDQllCaHVWOGk0T3Bhbk1qZ3JJZkkrU094S1ZLTDNaVjREWWZIWUVmK1NvQ3Zxbmwrd0xqZFR1a2ZDc3JXd0FDUXNGenhxeGUvZnQ4UE03NCtqcUpYanRTczNyZmhrb3l6MHZsWkxjUS9KV0NlSkV0Wk1nLzRYTmJVdjFxTGpEMjhnUURBU09mZkQrSWYrNS90ODJ1QTlqN2JqUDQraUVhRldVWnhMMkZ6ZmhrUlBsMkxuY3k4eEVuRmZsR0xETUZiTXdERU1TNFhDbytBRVBGbERPUHhBbzFkc3RhY3V0NFgveWhsU2xqNTA1ajViaUpNOGRNRXNVOUFFVzJSUFQvNnVCLytRRWFBMlg5eHA3Um9jRUNZNXNjSVp2N3R6Z1AwTThNWUtlT25QYW84OFV4dUpqRWU4NzFEeXRqWTY4SG9mSXYraXFydVFBQmdXTzVLQWhiNVZMN2M3bzZlTTlxV2R6N2JPaXhiYVFQSlcwbWdtVDVsLzhGT1JrL3hHMXppK3hNUXQ5ekxOT0JHWDBhWE5qWStEQ0lSYS8rbWY4UklHdEh3TUJIbSszRUdNMS92cEdKWCt1SDFCUUNqdzUxSEJWZys5L2VYMjhubzJmczZmM0IzaWR0TXJkMDlqNE1vNGFjalBhWXpzcW5vcjFWNWxRR1F0TGgxSjd1ZElEcENWUmtEZjNLNm80dmU3TVArY0g1THJOazRqWGZ1ZnNMbnphWk5yMEtib2JwVnJneUFSTnE5Q29SclZUc2Z6UGJ1eWVPT2E5UTV0N0o5SVdGSVdCdVBaTjc5RnorckF6K2ZBaVVBOUUxWW5sUGR6V0xtRFRSdXpESDJuR2tiUStMblVKc1JUK2ZuRTd6SGlXaWNtcUc4bXhHWjZaaHRmNVBsVXdLQWtjNDlTRVNMWllVTHV1S2xTcVlUblZUMHp5cDg5YVFWVzdPMFBYODJ3SDJYVHJSY3p3RnRkNFZwT1JyUDVEK29NZCttNmdkbTNPK2s5SGZMOGtrRElKN09uNjRSM3lzcmVBOGRBOWM2cGw3VCtZQ3F6a3IwUnNhOWtEd3NLN04zSVNLSnZtQ2IrdmVDMUZlTExNTnk3eVRnQThveW1FNnpVOUdIWmZqa0FNQ3NHUm4zV2RVVExXWk9PNmErME84YVZhWUJLalFKSzNjRFFKZFg1R0grb3AyS1hhTWl0MTYwSWk1eDRpdjVEZ0xhVlhRd3MrT2tZbEtyQ1NrQXhLMzhPUnI0eDBwR2lDaFhSSTVXK1I2cHlGZWxOU3gzRVFFcnEvR0pUeFl6TDh5bVlrOVVvMjNFKzBTbXF4MmV0MFoxcTUyWlRuZFMwZnVxMlZnZEFNVUFEMWRNL0pRdWFUTGpPaWVsZjc2YUFZMTZiNlRkbnhQaExCbDlZb3ZhU2NYK1ZZYTJFVFJ4eTcxWkF6NmxxS3ZETnZWa05aNnFBSWluM1NVYVFUVXcwZGVhdEpxeHRidzMwcmtkMHJOcVJzRTJvNjFoMmF3cWJoSnQzZmtDZ0trcVBtRFMzdUVrMng2cXhGTVZBSWFWYzVSdjZqSmRaS2VpeWpOWWxjYXAwTTVjOWNwKzQxcDJLQ1ZzWUcvTWRPZllnemVvNktrbnJXSGxQa3lnSHlqcFlEeHVwL1RqZlFOQUhGa0NYQkZCUTRXTGlCNG5xU2ZDOHVzUjloVlBMU1A0dTVMelBEbzBWSkhIeFU5eGZyVnlNRW1FanE5MFpGeHhCRENzM04ycVFZM01kSTZUaXY1RXlkbDFKbTRLQUFCSVpITHZBWk5TRUFpRGZ1Q1kwWXVIYy9Hd0FKajcxSWFKaFYyNy95NzkzU3h0K3Z6VlNVYVBDTXV5YjAram13VUFFS09BNWE2aFV0bzdxWWVCcmR1bVJLZXVPNXg2eWpFTUN3QnhxWU9ZdmkrbHBZL0lZM3dzbTlKdlVlRnBCRzNUQUFCQTNITGZxd0UvVS9GYnBWRjVlQUNrM1Q4Um9lSUVZcUFSWXI4ZkUvVERISU4ycVJqWENOcG1Ba0J4RkNodHlra0hrREQ0SWNlTXZVTjZCSmoxMUliRFczZjN2cWpXT1h5amJjYXVVT05wREhWVEFhQTBDbHlxQVYrVDlaN1kzT3BwYlRua2hYbUh2RHlVcCt3SUVFL25QNkVSZjB0V2dhQmpEY2M0Qy9TblZIZ2FSZHRzQURqeXFRMEhqOS9WMjZXeU84aUVEenBKL1E0cEFLanNtaFU3WHl6OXpKajB4S1JSSGQ5MGs4QUJqa3RZN2dNQTNpbnJTd2J1ZEV6OVFpa0FKS3pjcXlycFZ4bjhXY2VNTFpNMXB0RjB6VFlDQ1ArcFRnYkZITTFKeGZiS3o3RFhKNkE5dlNFUm9kNDFLcDNVMjRKWm5jZm96NnJ3TkpLMkdRRlFTbGJoYmxFSnp1bU5SQTd2bkQ5OTNVRGY3d1VBMWUvL2NNaHFaQWRYMDlXTUFCQnROdEx1Q2lLY1VxMzllOTZYbXdmc0JRRERjcGRUS2VPRjFNUGd1eDB6ZHE0VThRZ1JOU3NBRWhuM2MyQmNKK3ZXY3ZPQWNnQjRsb0NqcElVU1grd2tZMnFIRkxMQ0E2SnJWZ0RFcmR4Yk5OQXFXVGN4WTdXVDBoY00vd2xnamlTcy9FNlY1VVVod2tldm5SOTdUdGFJa2FCclZnQ2dHS21WM3lLYmFGT2tvblBNMktCQTAwRWpRREg2aEwyc2JDZVZFeWpMMjBpNnBnV0FtQWRZN2g5VjZpZjB0Q0wyL0R6ZDNlUC9RUUJvdDdyT2lNRDdsV3puTVBDVVkrcWhUKzdjekFDSVc3bGJOZEJGc24xV1lIcjcybFIwUlZrQUdGYnVTZ0twck9lWDI2YStWRmI1U05FMU13QVNtZndWWUw1ZTFyZE05SW1CMlVnSGZ3TFM3bTBnZkZCV21FaDBiS2YwcTZUcEZRakZPbmZNWm5lZUpxcDcxZmd3dFAySVdPbmVuQWNzMVpnRFNUclpHNkdkbmZPanErb1JKQ1BxSzZpMGpabS83YVJpbnh4bUJIRHZKK0RmWlAzTndJV09xZDhwU3k5REp3NmlXbmIxL2hlSUwxRFo1SkNSUFpJMERINEJSTmVXMjQrdnhTNlJkcWFWdUZOV0JvTi80cGl4L3RUOGcwY0F5MzBVd050a2hSV1kzN2syRlh0UWxyNGFuV0c1RnhEalZwKzNqcXVKRDhYN29SMVFxMUV6VnI5MndLVEN0dGRrNVREd2dHUHE3eW83QWlRczF3SlFOWlI0RDdOSDJrblpaTnNmWlpWWG9pdW1sQ1VPVlNoWkVPMHFMNE0vWlp1eGJ3WWluMWxMWlBMeUNTU1ovODlPeGZwLzVJTkdBQ1B0UGtPRW8yVU40d2ptTy9QMUoyWHBoNlVyaGpybE8xVjAxNnh6QkFXSXNqRzlrOGZwUWQyVVRsanVObEVOVmJKSmcrNExEQWFBbGV0U3kxZlRPdE0ycDRsNDlacWV4T3I4Y1Nod2FDNlAxdFFZU1dZeHlRd3FFYlNSenEwbm9rTmtWRFB3bkdQcS9UL3lJUUJ3dTJWM2xZU3lIYTB0MDhwRm1jZ1lNcERHeUxnWEV5TjBzWVNxN1ZDaFo4YWxUa3IvdWdyUGNMU0dKVUxFNUxidkdiemVNV050WmVjQWhxVUdnS0F1VHdTUlpESUlSelpTaGdkY2xqWDFtNExRYVZpNTUyV3Y3ZzA5dlIzNkNjZ1RxQjhkMVl6emlJL0tKbVBQVjZPcjl0NUk1NDhuNGo5Vm8ydXU5L1F2UVNYR1RGaXVTTHh4c0l4L1JPa2NKNlgzMTJvYXVoSFVxVkxJS2NoSllNSnluL2FiSUVtbTRlR2k0YnlkMUE4TEt1bXo0aVF3WTV0NmY2V1RJYXVBM0JORWxKSjFGa003MFRIYkF2bmxpb2tnRjFnY2JHaXkra2NyblVmMG9Xd3llbnNnOWlzdUF4bDQxREgxazRlYkF6eENRUC9MYWdZeWFZdWRaTnZ2cXRISnZrK2szZk1CaU8zb1JsWVVreld2ZGpwR2dUWDh1NVBVbFM3Y1ZGSjhoUFhxL2hPd2ZiT3NjYUlvbFpQU1R4OEdBTGw3Q2RUL3NxcFFwZy9icWVnUHE5SXBFUFRkU2ZnTU0xK29jaTFOUVVYRFNZc2w0YUQ5TDVOM2ZSQnpwb0VOTURyV3g4a3JPUEtONGgvYlp1eThzZ0JJcEhNL0JKRjBMbm9HTFhQTTZHZmxsWThNWlhPZkJuYWRDZlorS2U5Wi9wWnR4aTRaYmdSUU9nNW14aStjbEM0ZFB5aHZaTENVelF3QTFTUDhpc2ZCUGpLQlBXMmJlazNGRDRMdDZ2TFNtaGtBQ2NVamZFL0RxZGtGK2lObFJ3QWZSNHQ3eFpnMW9rTlZkVFF6QUF6RlM3eTdXbGgvOXBoWXZpd0E0Q01vbEtDMXJ6SGJwTStqVlRzdkNQcW1CY0NqM0pLWW5CY3JnSWt5ZmhLNUFoeFRuenlRZHErdzhJVGxpbnIyczJVRUNwcXc1Z1FZYUgrekFrRDVFSTNac2xPeFFmczg1UUFna2crOFZ4WUFRUWM0eU9wVm9XdGFBS2dtN2k1VGNhejJxMkhnTHNlTVJWVTZwTkcwelFvQXczS1ZOdTQ4NHZPenlkaGRGVDhCOFNmWEcxcHZ3VmJwcEgyWFExVzhGUXl0bjh1aDVZN3Z5eWFJVUwwZUhtUWR1MkRjTTFoS000NEE4WXk3VkdQOFZOWmZ3K1Z3R0FZQXJ0bzhRQ0U1c2F6QlFkSTFJd0JVRTBRQWczY0F5eThEKy80M1lia2ZCL0FkcFU0Z25tY25ZMDhyOFRTSXVOa0FNTE5qL2RTeFhtR0R5c25wY01tank0NEFzMWV2bjlGU0tMeWswajkreXBXb3lLK0Z0dGtBWUtUZC95U0NkRFFSTS9kZ3d0aXA1U3FQQjVjbURyd2U0L1VaKzlMRTFRSlZDZDVTN1labkZOUEVEYm9NVW5FVnNPZWxuK1RFVFBob2tHZmRFdTZRSW1tbUVVQjE4aWNjVk9rQ1Q5Q3BZdGM1eWVpUisxTEZTdUZTbmFpVUpOSld5OTdPcjlsSmZlcHc0V2NWazBVbnJOeGRBS21sZnlGNm41Mk1TaTlQMUwyZ3p0RXNJMEFpbzNyMlh5eC9NdWd5NkZEdlZRUkFlenAvYW9SWXF2aFF2MkJtMnpiMXVmVzRDYXZlOVNXT3BnQUFNeVV5N2xNQXpWSHhnd2RlbURWamZ4bU9wM0xCQ0IvWnFZVWlqK21UMlZUMDJ5cUcxcE8ycitMRzZ5bzZncnIwb3FLekVtM0N5bDBDMERjVTVhMnlUZjJmSy9GVXJ4aVN6cDFGUkQ5WFVjeU03dDJrSGZHczJhWldwRUZGaVNLdFllVjZaSytiRjQ5Tms5SDl3aktLR1UrOGZBaTBYYytwM05vUzdnbWtaSXlmSFBYRnZpbHo4cVRZWjRHU3E2Uy9aZUFPeDlUbEUyVUVhdW5ld2hLVzJzNXMwZjJNSjUyVVhyVWFlZFVSUUFqemUzV2JtVTRJUzhYUVJDWTNsNWxFeVpYSzl3NUU2SFlFeWJBa3ZqWXkrWGNSYzlYeWIzdkJodkF1TzZtTGZNSVZIeWtBOUtVajY1UzlnUGpHaEJBNUdqdHAzcHE1QjBnbk1LaG1jQzN2RTFiK2NvQnZHRTRHZzNjeDA3blpsSzcweWF2RnBrcThSeitaaTQ3cGhRM1FBU282WkgvOVFxWWNBQUNvWmhBYllQQnZiRk9YVGp1ajBsQS90T1ZLeDVicUcrTUIwdmp6WVRuUFNGcmN1aFA1LzFkSjJQSEdENDhYMmFuWUgyVDhJdzJBMHFkQXZYaTA0QXZicWtBVWowWlAvaHp5ZUFhSU5nS3R2dzhpejRHTXcyVnBFbGIrR3dEM3grL0w4akhqSGllbHYxK1dYZ2tBdnN2SGczZDZSRzlibTlTbDA1cktOcUFaNllxNWtvQzlpanRVYTZ0WXZjQWJjNVJLdlVNbEFBZ0RWQk1VdjJFMHYwYUlIQmYyQ09KcVRxNzMrMkt0UnVZSFZkTDE3ckhKQTErU05XTktsVjZVQVZEOE5uRmVGRFB1djJNdTd4VE9ZK3lZcEQxbm1yalB2dThaNGdGajlmb1VlbnNmODNVbjB1Y09yRElBaE0zeGRPNVlEZlJuZjdkNGVjM1d5S1NUMXMwL1VQcEc2NXNCS2FWQ0hidi9xRHJqRjc0cG52ZEhXcExPZ3VuU2VaNzMrTlFYQUVxZkFyVVVwWU02a2ZGTXp4aWNPakJwOFp1aGs0ZHJveWh0RCtBKzFaMitBZkkrYnB2NjkvejQwRGNBU3FzQ3RZb1ZBdzBzMWhsc29jV0JwSm56MC9LUThCUUxkSHIwWFQvZi9PS3ZIL3hyeDR5ZDRiYzVOUUhnYUt2cm4xcTVJRXFaU3FVb0syUGtkaWJ0ckNDVFRQaDFSTVA1eERXOGpMc01vTXY5Nm1aZ1hlK2tzWE5yeVRkWUV3Q0U0WE02MXIrVkM0VkgvQ01ZVE1BeU94bTlPcWljT1g0ZDJpZytzWnlHeGlMeWVxRmZuYVZkUzV5WVRjV2U4Q3REOE5VTWdPS253T2U2ZFlqaHErRFIwbENWYksvRnM4UHdsa0s2K1BzQTdlOVhQQU1lRVU2WDJldXZwaU1RQUJRbmhaYjdGUUExWmd2aExTRHRvMkdMS0tybVJKbjNJcW56eE1LMm13bTRRSWErRXMxd1ZVRDl5QTBNQUVVUXBOMTdRRGpianlHREpvamczM3RhNU9LMUM5citXcXVzRWVjWFFUVWQrUXZnOGRlSTZLRGE3ZUZQMjJaTU5UQmtXTFdCQXFDMFNlU3VBTkZKTlRlVWVRY1R2dVFrOVJ0RzY5eWdtSEFETExLZUhWZXpQMHJyL2V1ZFZPektJR1R0a1JFb0FJUlFrYlpzUExZL1JNQmJBakdVK1NVbTdjWnRVOXB1VzNjNDlRUWlzODVDNHVuOGZDTHZDb0RPcmhwL0lHbExQVG8vc0VuZzBEWVVUOXUydXo4aG92ZEl0aytHN0dVUHVMa0hFNzd6b25uUUZobUdSdFAwQmRGK0JzRGJnOUl0anFxWjZaSjZ4VmdHUGdJTWJMaGh1VjhtNFBOQk9hTlB6bllHSG1UZ1o5dW5STzhmNlZGaGRxWXJHV0YrTDhEaTF6NGp5TGFLMlQ2WXpuVlMwWHVDbER0UVZsMEJJQlFaYWZjRFJId3JRSzJCTjZJMFQvZ1ZNZjF1eDVpV2g0SklYVi9OUnYzeDNQZ0RXclVUUU41cERGcEt3S0hWZVB5OEY4a2xpV2hKRUV1OVN2cnJEZ0NodkQzakx0U1lmNmxXakVMZGJlSU9QRUZiQWVLSGU3V0kzWG5NSVgrdE5iSlg3SFpHTk1RajdKM0FMQW8xOC9HeTBjWHFMU2h4aUIwK2FEaWpFWEdKRFFHQWFOU2NwemNmNk8zcXZvZEFwL2wxakNxZk9DVWpJbEhXL2htUkpwMklOZ084MVNQdUprL3Joc1piUFkvSFJUUnRNanhNWW8wbms5aWc4Zmd3QUxOQWJOU3lZYU5xYjEvMzM4dmp4NTVmN2lhdlAzbVZ1Um9HZ0JLMG1lS1ovS1VhWTVtL28rUjZ1Q0FjTW92NWhFbTdiR0JSeDBaWTFsZ0E5TFdvV1BXYWNUZUlqbWhFSThPdWc1a2RoblorTmhWZDNXaGJSd1FBb3BFelh1SnhFMS9wdW9hWUwvZDdrTlJvWndXdmo4Vnk5ci90cFA2dGticFJQV0lBMk9QTTJWWnVUa3RwTkVnRTcrQndTaXlHb1FOMzdvWjJ4VWhmbnh0eEFQVE5EU0pHcHVzcUFvdE5GS20wcCtIc1dpbXJWdlZxdUxSemdTNWkva2Y4Q1FjQSt0eFFXaWxzL1FRQm9yangxQkgzVHJBR2RCU1lydzZ5MUc0UTVvVUtBSHNhSkRaYjltdlZMaUxpSytxMTBSS0U4NlJrTU52UXhIYytwbERVUVVweUlFU2hCRUIveTVnajhVeitQY1E0ajRnWDEyVTNNUkEzRGhaUzNNVVQyOVdzM2VHWWJmZlh1aGxWQnhQN1JZWWJBQU5hYmppNWcyZ0hMV1ZBcEt3NW5nS0taZ3JLdVdKaVI4eVBNZUd1SFppNFBLd0hWa1BiTzJvQU1ORHc5bzZ1d3pTUDN3bm1rNG40WklBT0RLb2pGZVZzQWlBdVlhN3NhY1VEb3pITWZWUUNZRkFuaVlpYjFmbTVLQlRMM1MwQ1lWNDk1ZzE5UzdlL0VWaHMxdnloRjFqWmFjYldLQUltZE9Takh3QmxYQ3B5QWtXNmU5cEpvemg3SE5lSURBQWlIR3NDZzhVeWN3S0pjdXRNazBEc0FSQkh6TnNCYkNPUStMdWRHWnNBWGd1aUxHbWE4NnFIYkpmWkp0NDExZE9VQUdpcUhxcHpZL1lCb000T0RydjRmUUFJZXcvVjJiNTlBS2l6ZzhNdWZoOEF3dDVEZGJadkh3RHE3T0N3aS84SExYdXhDUHNFTVBJQUFBQUFTVVZPUks1Q1lJST1cIiIsIm1vZHVsZS5leHBvcnRzID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUlBQUFBQ0FDQVlBQUFERFBtSExBQUFXOEVsRVFWUjRYdTFkZVp4YlZiMy8vbTVtYVV2TEtxS290RUJMbXh0b3FlMGtaZFVDOHV6ektTQ2xLSXVvYU5YM0JKV3RrMHpSVVpuY1lWRlJmQ3FLQlo2SUNDNElpQ0tsOE1DbHVkTlNwRTB5WFJDUWgyeksxbldXM08vN25FeG5tRTRuazNOdWJqSnA2UHpYM3Q5MmZ1ZWJzL3pPT2IrZm9BYi9qdW04YkVKWGIzMVlRclNGc0FXTUVMS3ZBT05JN0FIQk9JRGpCQmhQd29OZ0N5QmJoTndNa1MyRStqZi9DU0FEUVlZV005NkVNZW1WQjdadXFUVjN5UzdmSUVLaTZ4Wk5sNXcxbDVRVEFNNFFrWU9DYmhkQkN1VHZCRmVSZUpBaXkxYll5VFZCNjZtMHZGMFNBSE95elpOeWxIbENuQ0RBaVJEWnA5S095K3NqWDRUZ1FZaTF6S3ZIN3pvbXR6MHpLbmFVb0hTWEFjQlI2ZFo5YytoWklPRFpFQnhiUXB2THdxcEdDQUFQQTNKTHJqRjN4OHBEcjN5dExJb0NGbHJkQU9BWm9kamF5YWNoaDNNSnpCT1Irb0RiWHhaeEJMc0UrQzJCbjdqaHhyc2dyVjVaRkFVZ3REb0JRRWhUdG5tQjBHb1R3YUVCdEhQVVJKRDhHMkJkL1hMRDZ6ZHVtSEpkMTZnWlVrQngxUUZnZG1mOFExWU9qb2pZMWVhc2t1d2hYcURnVy9WVzcvZitOTzJxalNYSkNwQzVhZ0RRbEkyL1J6eTVWZ1JIQnRpK3FoTkY0SFVodjU2eUc3OVpEVlBEcUFOZ1ZpYng5aEJ4alFqT3FycmVLcU5CSkI2ejZxMnpsaDkyUmJhTWFvcUtIalVBdkpldGRac3ozVit3Z0ZZSXhoZTF0QVlKU1BZQWtzelovMnhiS1Qvc0dZMG1qZ29BWXBtV09RUnZFbURxYURTNjZuUVMyVjdCT1N2dDVLT1Z0cTJ5QUNBa2xvbGZESWdEUVYybEdrdndKU0hXVWVSVkFUWVMyQVJnb3dDYkNJd0JNRUdGaFVGTWdIQXZBSk1JVEJSSXhmelR0M1dVaTFOMjhyOHI1UmVscDJJTlBPTHA1bjNHYnBiYkJISnl1UnE0UFZ5N211UlNXckphd0xWUzE1aE9UV2w5M1ZUbnBDZGJ4K3kzYmV1VU9yR21raElSOGxnQ3h3bWswVlNXRVQxNVYxMG9kMDZsZGdvVkFjRDJJZjlYQXJ6ZHlCa2F4QVRVb2MxZEVHOXBUNTBzWFRYRmVVbUR6UmZKNVBVWE5PNlhtM0EweVpOQU9WbUEyYjRFRldFaThLUkg3L1FWa2ZaVjVaQS9XR2JaQVJETEpENEM0aWRCRHZrRVBJQkxRZDZRczErK2M3UVdVRE16TFJQcnlQa2ltQy9BbkNBN2kwUTM0SjNqUnRydkNGTHVVRmxsQlVCVE52NXBJYTRQYWk0bCtKcEF2dU0xeUkrcTdlQ2xhVVBMdTZUTCt5SUUveFhrTkVHeXhZMDR5WEtCb0d3QWlHWGpYd2JscXdFWi9peUYzOHp0MWZpRGFqK1RuOWw1MllIMVh0M2xJTThQNnV5Q3dCSTN2SDRoNUk1Y1FQNGNFQk04QU5SS1B4dS9IcEJQbDJxc1dyMVQwTExIdE1ZYkg1TFczbExsVlpKL1ZuclJRU0d4MmdYeTBXRDBjdWttTnA2V2pyU3FIVXhnZjRFRElKcEpmRitBejVaaVlkL1JxbHd2OVEyTC9LemdTOUVkTkc5VHB1VjRJWmNFZEtoMWZ5cThmbDZRSTBHZ0FJaGxFbDhEY0hrcFRpU1p5WW1jT3hwQmtWTHNIb2sza201dEdDL2Rpd2kybEx3K0lHOU1SWnhQQm1WcllBQ0lwbHMrSzhMdmwySVlnVy9sd3Y5Y05GcXIrbEpzMStHZDNibDRxcFhML1Z4RVp1alFGNlFoRXFsSTBpbEp4bmJtUUFBUXpUWi9GSlNmK2w3dGs2L0E0a2RTNGZZL0JOR29hcGFoWWduNzlJeHZ0eUJmTE1sT2tmbXBjTnN2UzVJUlJDUlFIZU5heEFPQWhQd1lRK0RQT1dEK1NqdjVuQi8rWFpVbmxtMCttWlJiQmJLZm56YW9PQUV0bWRzUmJ2dXpILzUrbnBKR2dHZzJ2cDk0a29iZ0FGOUdFTC83VjhQRzA2cnhwb3l2OWhneXZYdE44K1E2eTNyWWQ0UlVYVEt4R0hIRHpyOE1WUStRbHdTQVdEcXhESUs1ZnBTVHVHT2MzWERXcnJhOTg5UFdrWGhVQU1ucThwWkJaTEkvMlh3b0ZXNDgwZS9sRXQ4QWFFb25McllFMS9neHVpK3drZndVQk9vbTdaditUNDJrSU80WHlFdy96aUI0bFdzN2kvencrZ0pBZE8yaUdkSWJXdUVudnE5KythNmRQSE4zNSsvWVhlbzFVNDlYOTJjQkR2ZlRrYUNjbW9xMC9jYVUxeGdBczdpd1BwVFpyMU5FRGpGVkJ1S1BZKzJHdVcvMlliK1EzMkovU3h6QXJYVDl2R3hTVWRQYzNvMlRURVBseGdDSVpoSXRBbHhoMnZrRTF0UmJ2VWRYNnB6YjFMNXFvWisxZnZHaG9aNWN5cy91d005VVlBU0EvSWxYdDdmZU5KcEY4bmtaSzBlbURrbStVQzJPcm1ZN1pxZWJaNGJFVXRzN2RWdEorMC9kTWN6Qm03d3ljdVhmZFptTUFCQkxKKzZGWUo2dWNFV240dnFlaGVOV1RIUCtaTUpYVHRxKzBHelhtYVQwUFRvUlB2TnkvYVpicW1rN0drdkhQd0dSSmFaK0lIRzNHMGwrU0pkUEd3Q3hkTXNwRU42cEsvZ05PbDZSc3AyU3pnZk1kUmJtYU1vbVBtNTVhQjhhdTFCektHaDkyWTIwL1NCSWZhWElpbVlTTnd2d01SOHlUazdaeWZ0MStQUUF3RllybXVsZVozcWlSYkxEdFJ2bitOMmo2alRBaENhV2pWOE55aVVqOFpENHFodEp0cHJJTFJldHVwZDR3SmJ1UnlFSW0rZ2dtSFp0UjJzM29RV0FhRFp4bGhBL05UU2lLMGZ2TUpQNXlFUytLVzJzTXpFWEhwWVY0OHRQV1o0MVo4WGhiVzR4MmtwOG43TnVjWmk5dWRXbW9mYWN4Vk5XVEhQdUttWmpjUUNvQkF5WnhIcmpYei9RNXRySnhjVU1xTlQzV0RyeEN3aE8xOUpIL0M0VlNmNjdGbTBGaUdLWnhMVUF2bUNvNnRHVW5aeFZqS2NvQUdLZDhmbnd4T2hpb3Q4OWFURmpTL2tleXlTMjZxK3FtVXVGbmZwcUNWYjFCWWxDVHdoa2Z4TWZVUEIrTjV5OGJ5U2VvZ0NJcHVOcDQ1ZTZ4UG1wU05KNEJXdlNPQlBhMlByV1BkSFRiWlN3d1dQUDJ6c2lWejl2b3FlY3RORk00bE1DL01oRWh6cHBkZTNrTWI0Qm9JNHNRV3RFQkEwVnJtNzA1QmNnVlJUbno1OWFVdFQ3QWUwL3IwRU9xcXFieC9tcE9MN0s5REtKSjNMTVNFZkdJNDRBMFV4Y25WY2JYV3FrZUdlNTRmYWZhWHU2QW9RMUFRQUFUZG40aHkySzRTVVEvaWhsT3dzTHVia2dBS1kvZjhrZVkxOXVVTDhhazJqVTA2bHd3eUhWc3UzcmIzU3RBQUJxRk1qR1Z3c2tvdjI3SVRhOU1LNWgvNmNPYnQwMkhFOUJBS2hISFJibGg5cUs4a216K0ZrMzRseHZ3bE1KMnBvQkFJQm91dmtNRWV0MkU3K05OQ29YQkVBc0hmOGpSRVpjUUF3MlFzWDdONk54WWpyUzJtMWlYQ1ZvYXdrQWFoU0laZUxyVEM2UWtMalBqU1RmcnowQ1JEc1hIeXllOXplanpoRmVrd283bHhyeFZJaTRwZ0NnUm9Gcy9DS2hmRVBYZlNxNHRhMmg1MjJQVDc3bXhhRTh3NDRBMFd6ejU0WFdkYm9LRkIxRHVTUGRxVmYrMVlTblVyUzFCb0RwR3k1NTY5anUrbitZUkFjOXdTYzZ3c21idEFCZ0ZEWHJtL3N6YnNUUlg1aFVxdWUzNjZrMUFLaG1SVE9KZXdUNGdLNHJDZDdzMnM3SE5RRVFmOWtrL2FvbmpIZUVuWFpkWXlwTlY1TUFNRndNcWpXYUczRjJ5cyt3MHhRd081TTRQQVNzTnVra0NxZTZZV2VkQ1U4bGFXc1JBT3FCeWI0OTQ5VnplZTJNSlNMZXdjdkQ3VThOOXYxT0FEQ2Qvd3NocTVJZFhFeFhMUUlnUHcya0UwdEZjR0t4OXZkL0gyNGRzRE1BMHZFN1JHUytybEFTdDdxUjVObTY5S05CVjdzQWlDZEVwRTNYcDhPdEEzWUNRQ3lUVUVQNUZGMmhubkJoUjlneE9xVFFsUjBVWGEwQ1lFNDZIcVBJY2wwL3FWb0hydTI4dS9BVW9MSnpaeWQzbVd3dkFPdXdsSDNGZWwwalJvT3VWZ0VBdGxxeFRQZHJ1b2syVlNvNjEzWjJDTzN2TUFMMDNUN3hNcnFkTkp4QVhkNUswdFVzQUFERTBvbEhqT29uMVBlK0t6WGxxdi9yOS84T0FJaG00cWNLNU5lNm5VUHlyMjdFcWZya3pyVU1nR2dtZm9OQXp0ZnRNdy9lK3pyczlxVUZBSkJZSklEMmZqNy96Q3VTWEtDcmZMVG9haHNBaVVzRnVNckF0NThmbkkxMGh4RWdsbzR2Z2NnbmRJVlJtSFREVG9zdXZRbWQydWZ1M2JYbkRJUnk0MHo0aHFVVjJUUGtpZEc3T2RKYjRGa0lKT21rQmVseXB6bkx5M0ZKUnRWWE1Ha2J5ZSs2RWVlQ1FsUEEzUUw1RDEySFUvaHhOK3pjckV1dlE1Yy9pTXA1elJTZVp4TGswSkU5bWpRa25xQ0ZLNGFMeDVkaWwwbzdFL0s4VGwwWkJIL20yczVBYXY0ZFI0Qk0vRUZBM3FzckRPQUhVclp6cno3OXlKVFJiUHc4OGVRR1A2K09nN0toM0hLR2RrQ3ArbzU4c25YdnhxM2RyK2pLSVhpUGF6c2ZISFlFaUdYaUt3QXBlcFc0bjVuazhXN0VlVVJYK1VoMCtaU3lRRlZkSlF1aVhjUEo4TWd2ZEVTYzd3UWlYMjBGczkzYUNTUUovcTlyT3dNLzhxRzdnTFVDT1V6WE1JK1kyUkZKUHFaTFg1Q3U3NnBUcDRudWtuV09vZ0JWTnFiZTZuMW5VQytsbytuRVpzbFhROVg2MitHOXdCQUFKUDVoa3ErbXQ5NmF2SExLRlU5b3FSMkJxQ25iY3JSRlZzM2owVkxibzhPdkZwbEJKWUtPcHVQUGljamJkUFFDV0oreWt3TS84aUc3Z01SRzNhaVNVcmExb2Z1QTRXNlphQm95UUJiTHRpd0VXWFYzQ1UzYllVSlA0Q0xYVG43TGhLY1FyVW40bnNCenJwMDhjUGcxUU5vTUFFRTluZ2dpeVdRUWpxeWtEQW92ZHNQT040UFFHVTBuTnVnKzNSdDZlanQwRi9Bc0lBUG9LR1pjaitkTmVmVHc5ZzNGNklwOW45MFpQeWJreVIrTDBkWFVkL0grTGFqRW1MRjAvQVdJdkZYSFB3VFh1Yll6VUt0cDZCcWcwNlNRVTdDTHdNVGp2aE1rNmJTOHVtaWVUWVhYVHd3cTZiUFpJcEFyVTdZelVPbGtSd0NrNHlwQlVaTzJyeWpIcFNKdGdmeHkxVUpReUVjRXNMVDE3NnFFNUNkVEVlZkdRTXczM0FhQ2VEQVZTWjR3N0JvZ21vNC9JQ0lESDRzWjZGbmV2STVwN2I4dlJxZjdQWmFKbnd2S2t0b05CREVIc2Y0ekZXNHplbkF6a3Y5bVBiRm9yN3F1MEt1NlBnWjVWeXJpbkZKb0VYZ25CQU1maXdrbCtDblhkbjVjak03a3V3b0Z3L011RTBEZFlEVjVsbWFpcHFLMDI2dUovMCtQeDZ1Q1dETU5OajZXanRzUVNlczJpT1JQM1loenp2QWpRQ2J4WXdIMGM5R1Q3YW1JRTlkVlBscDB0WDBhMkhLYWdML1M5UzJKNjl4SThzSkNBREE2RGdieHkxUWtxWDEvVU5mSW9PbHFHd0JtUi9nQVJqb09OczRFOW5qS1RwWlcvQ0RvM2g1R1hpMER3UFFJM3lOTzZvZ2tIeGgyQlBCeHRMalRIYk1LOUtleGlob0hnTkVqWGlzazcvekwxTFpuaHdVQWZGd0s3UTB4dkhLcW8zMGViZHg3QVREVUtnQlVCZll0bWE1WFJXUVBMVGNSbTFLUjVJVEJ0RHRmQzAvSHN4Q1pwaVd3aW5NQ0RMYS9WZ0ZnZW9oR1lJVnJKM2VJOHd6ek1DUnh1d2pPMEFiQWtCc211bnlWcEt0VkFCZ243aDZtNGxqSlQ4TUEvaU5sTysrb1pJZWE2cXBaQUpnRzdvaHpPeUxKVzBhY0FwclNpeUtXaE5hWU9IbjM0MUFUYndWRDYrZHg2SERIOThNbWlJaWx6WjZISThBNmRzRzRaMGNwdFRnQ05LVVRDeXpCejNYOVZTaUh3L0FaUXRMRzZ3RHQ1TVM2QmdkSlY0c0FNRTRRTVNRQ09QdzJjUHYvTm1YaW43TWczelBxQkFzelV0T1NqeHZ4VklpNDFnQXdjMzE4Ly9vZWVkN2s1TFJROHVoaFI0QTUyZVpKcFBXa1NmLzRLVmRpSXI4VTJsb0RRRFNUK0pJQUpyZUp0bTFpdy83RFZSNFBMazBjOE54bU5remFuU2F1RktocThPWmZCSGV0TlVvVE44Sld2U0FBL0NRbmhzaG5nanpyMW5DSEZra3RqUUNtaTc4K0J4Vit3Qk53cWxnK2xRbzNIcm83VmF3V0xzMkoraEpHcnpISzNrNitrckkzN0Yvbyt0bkl5YUxUOFZ0RXhDajlpd2Z2SXgxMnUvYjJ4TndMNWh5MU1nSkVNMlpuLy9uZi9wREhvRU85TnlJQW1qTE5KMW13dElvUDlRdFc5UUhkY0hKNk9WN0NtbmQ5SDBkTkFFQ2xpTTNHL3dySUVTWitFSExPOG9pVEtzUXpjc0VJUDltcEZlckV1OEFOdDMvWHhOQnkwcXFLRzcxZTNlc21Pb0o2OUdLaWN5VGFwblQ4UWt2azJ5YnlDQ3gzN2VSUkkvRVVyUmdTeTdhY0R2SVhKb29CYnV3Tk5SNnljbXFyVVpFR014MW0xTkZNZkp2MmMzTjFiR29uOTZ5V1Vhd3BmZW5iTE5Tdk4zbTFsUi8rZ3lnWjR5dEhmZC9rYzJNcTR1amZMelRyVDJOcW8vUzN4RTJwU0ZJN1VZYXhNWVlNVWNQSWJKLzc4WmdiU1JhdFJsNTBCRkRDL0Q3ZHpsazh0bG9xaHNZNkU5UHBZVlh4NkJsekRIbXpxaVh4ZFZPMjVZTVdXYlQ4MjFCTVVmaEJOK3pjVXd4cldnRElweVBMZHF0YlA5cjVBN2VqOEptdDQ3MFpxeWUyYXljd0tHWndLZDlqNmZnbEVMbTZrQXdTM1JMaTJhbHBqdUdVVjRwVmhYbVBXdHZ5amx3djE0aGdieE1OdXI5K0pWTVBBUG5zMUdZWnhQb05KdkJiMTA1cXA1MHhhYWdmMnVGS3g2cDgrcURjSXlFc3JwYnpqRmxjV0YrWDNlOHZKZ2s3K3YyUkUyL3VpbkQ3UXpyKzBRWkFmaXJ3VVR5NmJ6RlNYYnNDVlR4Nm5OVjlsbmlZUk9FTFhuM29EMEhrT2RCeHVDNU5MQnYvTmlnRDkvZDErUURjbHJLVDJvVytqQURndTN3ODJDV3czcHV5MjdUVG1obzB1T1pJODdtU0tEc1ZkeWphVUdLVGg1NHBKdlVPalFDZ0RJaW16UklVRHhoTnZ0SmJoNk9yL1FaeFVTZVhtYUN2VnFQY2E1YXV0ODhvRWhlNmthUlJwUmRqQUtpNUtaUjl5MnFUWitTRGZQWXN4bUJXNnBEa0MyWDI0eTRwdm1sdGM1T1ZzeDcyOHliU2J3VFdHQURLczdQWHRFUkR3ai81ZThYTDFWMWpHNDkvN09CVy9SZXR1MlIzbWhtdENuVll4Q09tSy83dFdyYUJuSldLT05wNW52dXQ4d1dBL0ZTUU1VNVIrc1pzQUt5Vit0NlRCaWN0Tm5OWGJWSG5TOXZuY0pkcHBHOWdwMFg1bkJ0cCs0RWZyL2dHUU45NndLeGl4V0FEVmE0YVF1WUZrbWJPVDh1cmhLZXZRQ2UrNzJmTzc1djQ4WnRVSkhtcTMrYVVCSUJaYTF2ZkV1cnRXbTJRb213SE8wbHNZY2c3UGNna0UzNGRVWEUrOVF5dmMzSTdLSmY0MTgybjZxemM5Rkx5RFpZRUFHVjRVemIrSG90NHdDK0NWUkJHS08wcGUvM2xRZVhNOGUvUXluRDJiYWQ1dXdCei9HcFVVVXVQY3R5S3c5dGN2eklVWDhrQXlFOEZmdmV0Z3l4WFI1ZHNrQVZWVmJLOUZNOFc0RlZYdWtUNFE0SHM1VmM4QVEvQ1UzUmkvY1YwQkFJQXBTU1dUaVFoS0NsYkNNSFhDSDZtMm00VUZYT2l6bmVWMUxsaGE5ZTFBamxQaDM0a21rSlZRUDNJRFF3QWVSQms0cmNCY3FZZlEzWllJSUovNklHMWNKWGQ5blNwc2thZG41Q216c1I1bG9kdlFMQnZBUFo4TVdVbmpTNkdqS1F6VUFCc0R4SXRGZUQ0MGh2S3JaN2dheDNUTmx5OXE2NE5WTUlOeS9PV0NIQjA2ZjVRQzM1ZTVkck9vaUJrOWNzSUZBQkthRi9hTXVzK1FHSkJHRXJnU2NLNzVxV3hZNVk4ZFhEcnRpQmtsbHZHN0hUelRFdmtValVhRnI5L29HZE5PVG8vc0VYZzBDYW8wN2J4MHZVelFENnMxendOS3ZKRlFLN3RIWlA3M3NwRHIzeE5nNlBpSk5zdjBWNEc0SDFCS2M4ZlZRc3ZMTmNkeThCSGdNRU5qMlhpWHdka2NWRE9VSEpVN0FEZ3ZRQnZmM0hjbUx0SGUxU0laWnRua2RZWkFwNEp5S1JBMndwNEFweWRzcE8zQlNsM3NLeXlBa0FwaW1ZU0h3TjVnNGpVQjk4SWJpWGwxeUw4L2RhR252dUNTRjFmek1ham52blNXRy9qMkdNaFBKa2VGb2pJUWNWNC9IeFh5U1VobUIvRVZxOWlpOEJDaW1LWmxqa0VmMlZTak1LWDA4aU1XRmhLNEg0TFhMTjhXdnZUcGQ3c1ZkRk9LOWRqQzcxakFad0l3VEhhdDR2OU5DTFB3NmNZOGs2dHhMM0VzbzhBL1Q0NDR1bm1mY1p1bHRzRWNySnZ2NWd6cWtYak9oSnJJVmduNUt1RXRZbkliV1JJTmxyZ0p2RmtqQWRPRU1oNEFTWlFaQy94T0pFaVV3RkdTZ25ZbUp1YlgrbmZ1Wm1ONXc3M2t0ZVB2R0k4RlFOQUg3QWhUWm5FUlpZcVRpbW9LMmJjbStsN1h6NWh1WGh3VWNkS3RMK3lBTmplSWxYMTJnTnVGWkZES3RISWF0ZEJNTzJSNTY2SXRLK3F0SzJqQWdEVnlFbFB0bzU1NjlidVZnRXY4WHVRVkdsbkJhMVBoYjRGOHBWVXVPRzYwWHBSUFdvQTZIZm1yT3lpSTBJTTNmb21xaGFpNW5sMUFucHpiMTNEcGFQOWZHN1VBZEMzTnNpZmpiZlF3MlhhYVUrRC9qbFdTSjQ2OVlUd0lqZnMvS1ZDS2tkVVV4MEEyRzZpMmltTTIyeDludUFGQXRtL0dod1VvQTJQQXJ3OHlGSzdRZGhXVlFEb2I1QUt0dVEyTlo0UFR5NHRWNkFsQ09mcHlGQzNkU244U2tmWTBTN3FvQ00zS0pxcUJNQkE0M2hHS0pvNTlNTUNPWWZBdlBKRUU0Tnk1UnR5OGxFOHlMMmV4WnRXVEhYdUxqVVlGYnlGYjBpc2JnQU1hdmxSNmRaOWMraFpJT0RaRktwb1hGWFpuaiswQVI0RzVKWmNZKzZPYWoyd0dncW1xbktpTHRKblpsb20xaUgzQVl2V0NRQlBnTWcrdXJ4QjBoRjhDWlNIQUZrbURUMzM3SXJYM0hkSkFPelFpU3FOemJwRjA1RUxuUUJpTHNBWjVWZzM1TGR1a0w4VFhDV1FoM29sdDJ4bCtNclZRUUpxTkdUdCtnQVl4bXNxSjFCWGIzMVlRclNGc0FXTUVMS3ZBT05JN0lGOHFYV09FMkE4cVM1WXFpTm0yU0xrWm9oc0liQUZ4RXNRWmlISVFLeDBicy82ek1vRFc3ZU1SaWVWVTJkTkFxQ2NEcXMxMmJzQlVHczlhdGllM1FBd2RGaXRrZThHUUszMXFHRjdkZ1BBMEdHMVJyNGJBTFhXbzRidCtYOFMrdmNJZzRXc2NBQUFBQUJKUlU1RXJrSmdnZz09XCIiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFJQUFBQUNBQ0FZQUFBRERQbUhMQUFBSS8wbEVRVlI0WHUyZFcyd2NaeFhILzJkbjNTYjJBMEt0VkNPa1lzSVRGQ0h4QUVJSXdTc0N4RXVWaW90QTRtSnJseXBWQ042TGM4R0RVZUs5TmFGeHNydDIwOWFFY0dtRHlrTWxvRHhVcUNsRktsS0VMQkdwaUthcGdxSVdtZ3RRWnplSmR3NGF4NmxUaUxPN00rZWJiK3c1ZWMxMy91ZDgvL1BUSEg5cmY3TUUvWmRvQnlqUnU5Zk5Rd0ZJT0FRS2dBS1FjQWNTdm4xOUFpZ0FDWGNnNGR2WEo0QUNFSjBEbWZIcWgrRjBQZ1FQSXlCcXcvUE9NZys4UFB2dytLbm9xdEJNTnp0Zy9Ba3dWaWk5SytVaFMwUmZCL0RCVzluUGpBc0UvZ01ETHhBN3YyM1VjZ3ZhcG1nY01BYkExcTFQT1hlTm5KNENZVHVCQnZ2YUR2UHZQSGJjMlZydWozM0Y2ZUsrSFRBQ1FMWTQvVzUwVXI4QzRUTjlWM1JUQURQUE8ybHYvUEQwenZOaGREUjJiUWZFQVZodXZrY25BTHBQd25oL1BJQjVaN05XbUFPSUpUUlZZOVVCVVFDMmJUdDQ1OUtteXlkQTlERnBrNWx4MGdPTnpsWHpKNlcxazZ3bkNrQTJWem9Jb20ybURHV0cvd1I0ekVsM2lqb1daRndXQXlCYm5ON0NuZFJmaWVESWxMYTJ5dktwZ2JDclVjblA2bGdJNTdZWUFKbGNxVXhFK1hEbDlCZnRqd1VRc3MxSzRhWCtJblgxRFFma0FNaVhYaVBRdlZGYnEyTWhuT01pQUl6bEtoOXdpUDhXcnBTdzBYeVJHYnVhMVVKVHgwTHZYb29Ba01tWHYwckFzZDdUbWx1cFk2RS9iNlVBbUNUQTdTKzF1ZFgrV0NEQzR5bW5VOURUd3UxOUZnS2dORWVnVVhNdERhcXNZNkdiY3lJQVpIT2xuNExvSzkyUzJmcC9IUXRyT3k4Q1FDWmZlcEpBRDlocWNDOTVyNThXK0FrbjdlVjFMS3c2bGhnQVZyZk1GejNRN3ZjTXRwcXU2M3E5d0xPUjF5UVFnSlYyTWhhWU1KcjBENUdTQ3dBQUhRdVF1Uml5SG40R3VQMWpQTGxqSWRGUGdQK0RJb0ZqUVFINEh3cFdQa1NhVHptZFhCSk9Dd3JBV3JPQmNRbmczZmNNdFJzYitiU2dBSFE3NDIzd3NhQUFkQU5nNWJSQWhQbTAweW5NVE8vOFp3OGg2MmFKQXRCUHF4aVhtTEJuZUxCVjN5aGpRUUhvQjRBYmF6ZlFXRkFBZ2dDdytpSFNqd2ZTWG40OWp3VUZJQ0FBYjRldDg3R2dBSVFGWUoyUEJRVkFDb0RWMDhMUnROUEpyWmV4b0FBSUFyRDZNT0IvRVdQUFBVUHR3M0UvTFNnQUJnQzQ2ZWVEQlVweHRsNHV2bWd5VFJodEJTQ01lejNFcnZ4dUliWmpRUUhvb1lrU1N4anhIQXNLZ0VSMys5Rmd4R29zS0FEOU5FOXlMZlBSZE5vYnQzMWFVQUFrbTlxbmxqOFdBUHIrOEdEcmtLM1RnZ0xRWjlPTUxMYzRGaFFBSXgwTktHcGhMQ2dBQVh0bEtzd2ZDOHlZdkhCbXk2SGp4eC9vbU1welExY0JNTzF3UUgxbVBnV2liNWkrdDZBQUJHeFFOR0c4eEtDcDRjSFdYbE0vSkNvQTBYUXlWQlptZnE1OTdjNzc1My8wM1V1aGhHNFJyQUJJTzJwS2o3SHdGcWMrK1pOYWJsRXloUUlnNmFaaExXYjh1bGt0ZkY0eWpRSWc2V1lFV3N5MG8xbk5INUJLcFFCSU9SbVJEb1BiUytuT3lKRjl1OTZRU0trQVNMZ1lzUVl6enphcnhZeEVXZ1ZBd3NXb05SaUxyYUhXM2ZPdTJ3NmJXZ0VJNjZDbGVNL2pMODdXaXMrRVRhOEFoSFhRVmp6elZLTmFuQXliWGdFSTY2Q2xlQWJxelVyaHdiRHBGWUN3RGxxS2wvcEJVQUd3MU1EUWFaa25HOVhpVkZnZEJTQ3NnN2JpaVQvWEtCZC9FemE5QWhEV1FRdngvb2RCaTU1enQ4VHZCUlFBQ3cwTW01TEJ2MmhXaWw4T3ErUEhLd0FTTGthc1FVd2ZyVmZ6ZjVaSXF3Qkl1QmloQmpNLzNxd1d2eVdWVWdHUWNqSUNIUWFmOFFiYjk4MjU3bVdwZEFxQWxKUG1kYzVkODFLZk9sTEx2U3FaU2dHUWROT1lGdi9sR3VpelJ5cUZ2MHVuVUFDa0haWFdZejY2YWVtT3pJRURPMXJTMG5vS01PR29tQ1pmSk5DMzY1WEMwMktTdHhEU0o0Qkpkd05vUi8ydVlnVWdRSk9NaFZoNC82QUNZS3lidlF2YnZDV3NBUFRlSnpNcm1ZK2wwOTRPVys4SlVBRE10TFdycW4vM0w1WENxTzBYU0NrQVhWc2x1NENCL3hDeCsrYnBMWTlFY2Z1M1cvVUtRRGVISlArZjRYKy80dlo2TmYrNnBHd1lMUVVnakh1OXg3N3NFWS9ObG92UDl4NFN6VW9Gd0tEUERMNE14ZytIaDlvMTEzV1hES1lLTEswQUJMYXVhK0RURHJEdFVLVndydXRLaXdzVUFHSHptZkVLMkJ0cjFpYWVFNVkySXFjQVNObkthREZoK3Z4Z3EzemNkYTlLeVpyV1VRQWtIR1oraGpvREQ5YjNmKytzaEZ5VUdncEFDTGY5djlBQklkTXNGNThOSVdNMVZBRUlZai9qQ2hNcUE2M05lMmRtSHJvU1JDSXVNUXBBbjUxZzRGbWt2RXl6TkhHbXo5QllMbGNBZW0wTDR5d1J0cHYrQTQxZXk1RmFwd0IwY1pMQlY4SFkzeDVxLzBEaWhReFNqWlBTVVFCdTR5U0RuL2M0OWMyNWF2NFZLY1BqcHFNQTNMb2o1NGhwUjcyYWZ6SnVEWk91UndGNGg2Tzh4RXlQcEJaYmJyM3V2aVZ0ZGh6MUZJQzN1OEl2ZXAzMDZPekQ0NmZpMkNoVE5Ta0FqTmZCbkd2VWlzZE1tUnhuM2NRQ3dJd09DSWNIV3B2M3pNdzg5Tzg0Tjhsa2JZa0VnSUdYeUV1Tk5tcTVCWlBtcmdmdFJBSEFqRGNCcjlDc0ZwOEFpTmREZzB6WG1CQUEyQU5vcm5YMWpna1Q3OXczM1NTVCtrSUFsSThTOERXVGhRYlZac1pKRHpRNlY4MmZES3F4a2VORUFNam1Tb2RBRlBxbGhaSkdNK01DRVUwMEtybEg5WEcvdHJNaUFHUnlwU0lSVFVzMk1LaVdmN2tTd0dOT3VsTThQTDN6ZkZDZHBNUUpBVEI5UDFIcWw5Wk5zM0M1MHZxZVF4WWdBc0JZb1hTdncvUmF5Rm9DaDY5Y3J0dzlQTmlxbS9wMnJjREZ4VHhRQkFCL2o1bDg2VlVDalVTK1h3dmZ0aG41SGcwbUZBTWdteS92QXpCaHNOWjNTTWZsY21WVSt6V1ZSd3lBNytRcXd4NTUvbE5nazZsaWZWMy9jaVdZSnMrZkdUa1loOHVWSnZjYWhiWVlBTXRqSUZmS0UxSFpWT0hNK0hrS3k3K25qODNsU2xON2pVcFhGSURyRUpSL1JnU1I5OWplWkVKc0wxZEcxU2hUZWNRQjJMcjFLZWV1OTU4K1JxQXZoUzZhc2NqZ3FlR2g5djY0WHE0TXZVZkxBdUlBM05oUEpsL2U1ZCtNSmVyL2hkVCs2OURCbUFVNys1cTEzRDhzZTdTaDB4c0Q0UHJSc1B4eFlqd0t3a2Q2Y2RGdnZMLysya0JucjlRWEkvYVNOOGxyakFMZ0crdTZidXFOeTV1L3dJeFBBL2dFQ084RDQ3M0xUd2JHRlJEL0NZemZjd292ZUp2Ykp5UmZoSnpreHZhNmQrTUE5RnFJcnJQamdBSmd4L2ZZWkZVQVl0TUtPNFVvQUhaOGowMVdCU0EycmJCVGlBSmd4L2ZZWkZVQVl0TUtPNFVvQUhaOGowMVdCU0EycmJCVGlBSmd4L2ZZWkZVQVl0TUtPNFVvQUhaOGowMVdCU0EycmJCVGlBSmd4L2ZZWlAwdm5LM3JyaHhEeDlZQUFBQUFTVVZPUks1Q1lJST1cIiIsImltcG9ydCAnLi4vc3R5bGVzaGVldC9tYWluLmxlc3MnXG5cbmZ1bmN0aW9uIGxpbmVUYWJsZShjYW52YXMsIGRhdGEsIG9wdGlvbnMpe1xuICB2YXIgY3h0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAvLyDmlbDmja7pooTlpITnkIZcblxuICBjb25zb2xlLmxvZyhkYXRhKTtcblxuICAvLyBkYXRhLnNvcnQoZnVuY3Rpb24oYSwgYil7XG4gIC8vICAgcmV0dXJuIGEueCAtYi54O1xuICAvLyB9KVxuXG4gIC8vIOS4jeWQjOWxj+W5leaUvuWkp+WkhOeQhlxuICAoZnVuY3Rpb24gKCkge1xuICAgIC8vIOWxj+W5leeahOiuvuWkh+WDj+e0oOavlFxuICAgIHZhciBkZXZpY2VQaXhlbFJhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcblxuICAgIC8vIOa1j+iniOWZqOWcqOa4suafk2NhbnZhc+S5i+WJjeWtmOWCqOeUu+W4g+S/oeaBr+eahOWDj+e0oOavlFxuICAgIHZhciBiYWNraW5nU3RvcmVSYXRpbyA9IGN4dC53ZWJraXRCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG4gICAgICBjeHQubW96QmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuICAgICAgY3h0Lm1zQmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuICAgICAgY3h0Lm9CYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG4gICAgICBjeHQuYmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fCAxO1xuXG4gICAgLy8gY2FudmFz55qE5a6e6ZmF5riy5p+T5YCN546HXG4gICAgdmFyIHJhdGlvID0gZGV2aWNlUGl4ZWxSYXRpbyAvIGJhY2tpbmdTdG9yZVJhdGlvO1xuXG4gICAgY2FudmFzLnN0eWxlLndpZHRoID0gY2FudmFzLndpZHRoICogcmF0aW87XG4gICAgY2FudmFzLnN0eWxlLmhlaWdodCA9IGNhbnZhcy5oZWlnaHQgKiByYXRpbztcblxuICAgIC8vIGNhbnZhcy53aWR0aCA9IGNhbnZhcy53aWR0aCAqIHJhdGlvO1xuICAgIC8vIGNhbnZhcy5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0ICogcmF0aW87XG4gIH0pKCk7XG5cbiAgLy8g57uY55S75puy57q/XG4gIHRoaXMucGFpbnRMaW5lID0gZnVuY3Rpb24gKCkge1xuICAgICAgY3h0LmJlZ2luUGF0aCgpXG4gICAgICBjeHQuc3Ryb2tlU3R5bGUgPSBcIiMyQ0NDRTRcIjtcbiAgICAgIGN4dC5saW5lV2lkdGggPSA1O1xuICAgICAgY3h0Lm1vdmVUbyhkYXRhWzBdLngsIGRhdGFbMF0ueSk7XG4gICAgICBjeHQubGluZUpvaW4gPSBcInJvdW5kXCI7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIGN4dC5saW5lVG8oZGF0YVtpXS54LCBkYXRhW2ldLnkpO1xuICAgIH1cblxuICAgIGN4dC5zdHJva2UoKTtcbiAgfVxuXG4gIC8vIOe7mOeUu+WdkOagh+eCuVxuICB0aGlzLnBhaW50UG9pbnQgPSBmdW5jdGlvbigpe1xuICAgIGRhdGEuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgIGN4dC5maWxsU3R5bGUgPSBcIiMyQ0NDRTRcIjtcbiAgICAgIGN4dC5iZWdpblBhdGgoKTtcbiAgICAgIGN4dC5hcmMoaXRlbS54LCBpdGVtLnksIDE1LCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XG4gICAgICBjeHQuY2xvc2VQYXRoKCk7XG4gICAgICBjeHQuZmlsbCgpO1xuXG4gICAgICBjeHQuZmlsbFN0eWxlID0gXCIjRkZGRkZGXCI7XG4gICAgICBjeHQuYmVnaW5QYXRoKCk7XG4gICAgICBjeHQuYXJjKGl0ZW0ueCwgaXRlbS55LCAxMCwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xuICAgICAgY3h0LmNsb3NlUGF0aCgpO1xuICAgICAgY3h0LmZpbGwoKTtcbiAgICB9KVxuICB9XG5cblxuICB0aGlzLnBhaW50TGluZSgpO1xuICB0aGlzLnBhaW50UG9pbnQoKTtcbn1cblxudmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXlMaW5lVGFibGVcIik7XG5uZXcgbGluZVRhYmxlKGNhbnZhcywgW1xuICB7eDogMjAsIHk6MjMwfSxcbiAge3g6IDIwMCwgeTo0MH0sXG4gIHt4OiA0MDAsIHk6MTYwfSxcbiAge3g6IDYwMCwgeTozMH0sXG5dLHtcbiAgd2lkdGg6IDY0MCwgaGVpZ2h0OjI4MFxufSk7IiwiXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uL25vZGVfbW9kdWxlcy9sZXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL21haW4ubGVzc1wiKTtcblxuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG5cbnZhciB0cmFuc2Zvcm07XG52YXIgaW5zZXJ0SW50bztcblxuXG5cbnZhciBvcHRpb25zID0ge1wiaG1yXCI6dHJ1ZX1cblxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbm9wdGlvbnMuaW5zZXJ0SW50byA9IHVuZGVmaW5lZDtcblxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9saWIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2FscztcblxuaWYobW9kdWxlLmhvdCkge1xuXHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vbm9kZV9tb2R1bGVzL2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbWFpbi5sZXNzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vbm9kZV9tb2R1bGVzL2xlc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vbWFpbi5sZXNzXCIpO1xuXG5cdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cblx0XHR2YXIgbG9jYWxzID0gKGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdHZhciBrZXksIGlkeCA9IDA7XG5cblx0XHRcdGZvcihrZXkgaW4gYSkge1xuXHRcdFx0XHRpZighYiB8fCBhW2tleV0gIT09IGJba2V5XSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZHgrKztcblx0XHRcdH1cblxuXHRcdFx0Zm9yKGtleSBpbiBiKSBpZHgtLTtcblxuXHRcdFx0cmV0dXJuIGlkeCA9PT0gMDtcblx0XHR9KGNvbnRlbnQubG9jYWxzLCBuZXdDb250ZW50LmxvY2FscykpO1xuXG5cdFx0aWYoIWxvY2FscykgdGhyb3cgbmV3IEVycm9yKCdBYm9ydGluZyBDU1MgSE1SIGR1ZSB0byBjaGFuZ2VkIGNzcy1tb2R1bGVzIGxvY2Fscy4nKTtcblxuXHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0fSk7XG5cblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59Il0sInNvdXJjZVJvb3QiOiIifQ==