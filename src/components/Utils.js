import React from "react";
import namor from "namor";

const range = len => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  const statusChance = Math.random();
  var getRandomDate=function(){
    var today = new Date(Date.now());
    return new Date(today.getYear()+1900,today.getMonth(), today.getDate()+Math.random() *8, Math.random()*2 + 2, Math.random()*60)
  }
  return {
    firstName: namor.generate({ words: 1, numbers: 0 }),
    lastName: namor.generate({ words: 1, numbers: 0 }),
    age: Math.floor(Math.random() * 30),
    visits: Math.floor(Math.random() * 100),
    progress: Math.floor(Math.random() * 100),
    dateOfBirth: getRandomDate().toString(),
    status:
      statusChance > 0.66
        ? "relationship"
        : statusChance > 0.33 ? "complicated" : "single"
  };
};

export function makeData(len = 53) {
  return range(len).map(d => {
    return {
      ...newPerson(),
      children: range(10).map(newPerson)
    };
  });
}
