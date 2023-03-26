let SHEET_ID = "1C3TQe1YOrm1Dd8jWE89sAWF-DqvcHmCsiaLfiRweP_A";
let SHEET_TITLE = "objects";
let SHEET_RANGE = "A1:Z100";

let FULL_URL =
  "https://docs.google.com/spreadsheets/d/" +
  SHEET_ID +
  "/gviz/tq?sheet=" +
  SHEET_TITLE +
  "&range=" +
  SHEET_RANGE;
let objArr = [];
let data;
fetch(FULL_URL)
  .then((res) => res.text())
  .then((rep) => {
    data = JSON.parse(rep.substr(47).slice(0, -2)); //看不懂这句是什么意思，但是他把数据处理成可读对象了。
    console.log(data.table.rows); //会自动排除第一行
  })
  .then(() => {
    objNums = data.table.rows.length;
    for (let i = 0; i < objNums; i++) {
      getRowData(i);
    }

    function getRowData(rowNum) {
      let objName = data.table.rows[rowNum].c[0].v;
      let objPrice = data.table.rows[rowNum].c[1].v;

      let objImgURL = data.table.rows[rowNum].c[3].v;
      let objDescribe;
      objDescribe = setValueBySheet(4, "暂无描述");

      let objOriPrice;
      objOriPrice = setValueBySheet(2, "???");

      let soldOut;
      soldOut = setValueBySheet(5, false); //如果没有值，返回false 表示没有卖出
      let soldClass = "";
      if (soldOut) {
        soldClass = "sold-out";
      }

      function setValueBySheet(idx, nullValue) {
        console.log("当前正在打印" + idx);
        console.log(data.table.rows[rowNum].c[idx]);

        if (
          data.table.rows[rowNum].c[idx] === null ||
          data.table.rows[rowNum].c[idx] === undefined ||
          data.table.rows[rowNum].c[idx].v == null
        ) {
          return nullValue;
        } else {
          //如果该值不为空
          console.log(`${idx},${data.table.rows[rowNum].c[idx]}`);
          return data.table.rows[rowNum].c[idx].v;
        }
      }
      let obj = {
        name: objName,
        price: objPrice,
        oriPrice: objOriPrice,
        imgUrl: objImgURL,
        describe: objDescribe,
        soldClass: soldClass,
      };

      objArr.push(obj);
    }

    console.log(objArr);
  })
  .then(() => {
    // 创建html元素
    for (let i = 0; i < objArr.length; i++) {
      let name = objArr[i].name;
      let price = objArr[i].price;
      let imgUrl = objArr[i].imgUrl;
      let describe = objArr[i].describe;
      let oriPrice = objArr[i].oriPrice;
      let soldClass = objArr[i].soldClass;

      //r如果卖出，应该在li的class里加入“sold-out”

      if (price == 0) {
        price = "無料";
      } else {
        price = price + "円";
      }

      if(oriPrice!='???'){
        oriPrice = oriPrice+'円'
      }

      let li_innerHtml = `          
            <div class="name ">${name}</div>
            <img src="${imgUrl}" alt="" srcset="">
          <div class="price"><p class="price-pre">原价: ${oriPrice}</p>
          <p class="price-now"> ${price} </p> </div>          

           <div class="describe hide">${describe}</div>
        `;
      const itemsUl = document.getElementById("item-contents");
      let li = document.createElement("li");
      li.classList.add("item");
      if (soldClass == "sold-out") {
        li.classList.add("sold-out");
      }

      li.innerHTML = li_innerHtml;

      itemsUl.appendChild(li);
    }
  })
  .then(() => {
    isChecked();//启动之后先执行一次，筛选

    const items = document.querySelectorAll(".item");

    console.log(items);
    // console.log(items.childNodes)

    items.forEach((element) => {
      const p = element.querySelector(".describe");

      element.addEventListener("mouseover", (t) => {
        if (p) {
          p.classList.remove("hide");
        }
      });
      element.addEventListener("mouseleave", (t) => {
        if (p) {
          p.classList.add("hide");
        }
      });
    });




  });

  function isChecked(){
    if(document.getElementById("check-in-stock").checked){
       const div =  document.getElementById('check-div')
       div.classList.add('checked');

       document.querySelectorAll('.sold-out').forEach(item=>{
        item.classList.add('hide');
    })
}else{
    document.getElementById('check-div').classList.remove ('checked')
    document.querySelectorAll('.sold-out').forEach(item=>{
        item.classList.remove('hide');
    })
}}


