const typeChart = {
  normal:    { rock: 0.5, ghost: 0, steel: 0.5 },
  fire:      { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:     { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric:  { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass:     { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice:       { fire: 0.5, water: 0.5, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting:  { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison:    { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:    { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:    { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:   { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:       { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:      { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:     { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:    { dragon: 2, steel: 0.5, fairy: 0 },
  dark:      { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel:     { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, fairy: 2 },
  fairy:     { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

//real time prevention of invalid characters and ctrl+ cmds
const inputBox=document.querySelector("input");
inputBox.addEventListener("input", function(event)
{
  const allowedCharsRegex = /[^a-zA-Z0-9♀♂. -]/g;
  const old=inputBox.value;
  const cleaned = old.replace(allowedCharsRegex, "");
  inputBox.value = cleaned;
});

//invoking getPokemon on clicking Go
const goBtn=document.querySelector(".black-button");
goBtn.addEventListener("click",getPokemon);

//home on off
function turnOffHomeScreen()
{
  document.querySelectorAll(".home-screen>p").forEach(p => {
      p.style.display = 'none';
    });
}
function turnOnHomeScreen()
{
  currentlyAt="home";
  document.querySelectorAll(".home-screen>p").forEach(p => {
      p.style.display = 'block';
    });
}

//setUpHomeScreen
function setUpHomeScreen(data)
{
  const poke=data.name;
  document.getElementById("name").innerHTML=poke.charAt(0).toUpperCase()+poke.slice(1);
  document.getElementById("id").innerHTML=data.id;
  document.getElementById("height").innerHTML=data.height*10 + " cm";
  document.getElementById("weight").innerHTML=data.weight/10 + " kg";
  types=[];
  for(let i of data.types)
  {
    types.push(i.type.name);
  }
  document.getElementById("type").innerHTML=types;
  get_WI(types);
  act_abi=[];
  pass_abi=[];
  for(let i of data.abilities)
  {
    if(!i.is_hidden)
      act_abi.push(i.ability.name);
    else
      pass_abi.push(i.ability.name);
  }
  document.getElementById("active").innerHTML=act_abi;
  document.getElementById("passive").innerHTML=pass_abi;

//get weakness nad immunity
}
function get_WI(types)
{
  const allTypes=Object.keys(typeChart);
  const effectiveness={};
  for(let type of allTypes)
  {
    effectiveness[type]=1;
  }
  weakness=[];
  immunity=[];
  for(let atkType of allTypes)
  {
    for(let defType of types)
    {
      const multiplier=typeChart[atkType][defType]??1;
      effectiveness[atkType]*=multiplier;
    }
  }
  for(let type of allTypes)
  {
    if(effectiveness[type]>=2)
      weakness.push(type);
    if(effectiveness[type]===0)
      immunity.push(type);
  }
  document.getElementById("weakness").innerHTML=weakness;
  document.getElementById("immunity").innerHTML=immunity;
}

//fill stats
function fillStats(data) {
  document.querySelectorAll(".inner-ul").forEach((iul, index) => {
    const liToFill = Math.round((16 / 255) * data.stats[index].base_stat);

    iul.querySelectorAll("li").forEach((liSeg, i) => {
      if (i < liToFill) {
        liSeg.classList.add('filled');   // fill this bar
      } else {
        liSeg.classList.remove('filled'); // keep empty
      }
    });
  });
}

async function getPokemon()
{
  try
  {
    var nameOrId=inputBox.value.toLowerCase();
    nameOrId = nameOrId.replace(/^0+(?=\d)/, "");
    console.log(nameOrId);
    const apiUrl=`https://pokeapi.co/api/v2/pokemon/${nameOrId}`;
    const response=await fetch(apiUrl);
    if(!response.ok)
    {
      throw new Error();
    }
    var data=await response.json();
    console.log(data);

    setUpHomeScreen(data);
    turnOnHomeScreen();
    document.querySelector(".pokemon-picture").src=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;
    fillStats(data);  
  }
  catch(error)
  {
    console.log(error);
  }
}