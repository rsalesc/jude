/**
 * Created by rsalesc on 14/06/16.
 */

const path = require("path");
const fs = require("fs-extra");
const util = require("util");
const glob = require("glob");

async function exists(p) {
  try {
    await fs.stat(p);
    return true;
  } catch (e) {
    return false;
  }
}

async function fileExists(p) {
  try {
    const res = await fs.stat(p);
    return res.isFile();
  } catch (e) {
    return false;
  }
}

async function dirExists(p) {
  try {
    const res = await fs.statAsync(p);
    return res.isDirectory();
  } catch (e) {
    return false;
  }
}

function inspect(p) {
  return util.inspect(p, false, null);
}

function logInspect(p) {
  return console.log(inspect(p));
}

function fillUpTo(arr, n = 0) {
  if (n === 0)
    return [];
  if (!(arr instanceof Array) || arr.length === 0)
    arr = [undefined];

  while (arr.length > n)
    arr.pop();
  while (arr.length < n) {
    const el = arr.pop();
    arr.push(el);
    arr.push(el);
  }

  return arr;
}

function destroy(obj) {
  for (const prop of Object.keys(obj)) {
    const property = obj[prop];
    if (property != null && typeof property === "object")
      destroy(property);
    else
      obj[prop] = null;
  }
}

function normalizePath(p) {
  const normalizedPath = path.normalize(p);
  if (normalizedPath[-1] === "/")
    return normalizedPath.slice(0, -1);
  return normalizedPath;
}

// eslint-disable-next-line require-await
async function globAsync(pattern, opts) {
  return new Promise((resolve, reject) => {
    glob(pattern, opts, (err, files) => {
      if (err)
        return reject(err);
      return resolve(files);
    });
  });
}

async function mkdtemp(...args) {
  return new Promise((resolve, reject) => fs.mkdtemp(...args, (err, result) => {
    if (err)
      return reject(err);
    return resolve(result);
  }));
}

module.exports = {
  exists,
  fileExists,
  dirExists,
  inspect,
  logInspect,
  fillUpTo,
  destroy,
  globAsync,
  mkdtemp
};
