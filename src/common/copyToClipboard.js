const copyToClipBoard = (str) => {
  const el = document.createElement("textarea");
  el.style = "color:transparent;background:transparent;height:1px;width:1px;";
  document.body.appendChild(el);
  el.value = str;
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

module.exports = {
  copyToClipBoard,
};
