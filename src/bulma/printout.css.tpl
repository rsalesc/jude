@media print {
  .no-print {
    display: none;
  }
}

.no-print {
  color: red;
}

pre{
    counter-reset: line;
}
code{
    counter-increment: line;
}

code:before{
    content: counter(line);
    display: inline-block;
    width: 35px;
    font-size: 11px;
}

code:before{
    -webkit-user-select: none;
}
