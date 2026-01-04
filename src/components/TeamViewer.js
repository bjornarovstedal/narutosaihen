import { useState } from 'react';
import '../App.css';

const teams = [
  {
    name: "Leaf 16",
    village: "Konohagakure",
    image: "/images/teams/leaf16.png", // or whatever the filename is
    members: [
      { name: "Uzumaki Naruto" },
      { name: "Haruno Sakura" },
      { name: "Uchiha Sasuke", leader: true }
    ]
  },
  {
    name: "Leaf 15",
    village: "Konohagakure",
    image: "/images/teams/leaf15.png",
    members: [
      { name: "Nara Shikamaru", leader: true  },
      { name: "Akimichi Chōji" },
      { name: "Yamanaka Ino"}
    ]
  },
  {
    name: "Leaf 14",
    village: "Konohagakure",
    image: "/images/teams/leaf14.png",
    members: [
      { name: "Aburame Shino" },
      { name: "Hyūga Hinata" },
      { name: "Inuzuka Kiba", leader: true }
    ]
  },
  {
    name: "Leaf 13",
    village: "Konohagakure",
    image: "/images/teams/leaf13.png",
    members: [
      { name: "Tenten" },
      { name: "Rock Lee" },
      { name: "Hyūga Neji", leader: true }
    ]
  },
  {
    name: "Sand 3",
    village: "Sunagakure",
    image: "/images/teams/sand3.png",
    members: [
      { name: "Kankurō", leader: true },
      { name: "Gaara"},
      { name: "Temari" }
    ]
  },
  {
    name: "Sound 2",
    village: "Otogakure",
    image: "/images/teams/sound2.png",
    members: [
      { name: "Abumi Zaku", leader: true },
      { name: "Kinuta Dosu" },
      { name: "Tsuchi Kin" }
    ]
  },
  {
    name: "Grass 1 / \nLeaf 12",
    village: "Kusagakure",
    image: "/images/teams/grass1.png",
    members: [
      { name: "Gōmonjō Yoroi" },
      { name: "Hana Shiore", leader: true },
      { name: "Misumi" }
    ]
  },
  {
    name: "Rain 4",
    village: "Amegakure",
    image: "/images/teams/rain4.png",
    members: [
      { name: "Maboroshi Shigure", leader: true },
      { name: "Yuie Baiu" },
      { name: "Oboro" }
    ]
  },
  {
    name: "Rain 5",
    village: "Amegakure",
    image: "/images/teams/rain5.png",
    members: [
      { name: "Tagi" },
      { name: "Daike", leader: true },
      { name: "Edadera Utabei" }
    ]
  },
  {
    name: "Stone 11",
    village: "Iwagakure",
    image: "/images/teams/stone11.png",
    members: [
      { name: "Heiwa" },
      { name: "Enakiri Koishi" },
      { name: "Jinsoku", leader: true  }
    ]
  },
  {
    name: "Stone 13",
    village: "Iwagakure",
    image: "/images/teams/stone13.png",
    members: [
      { name: "Isenishi Chinari", leader: true },
      { name: "Shinobaru Mawan" },
      { name: "Sekitsuki Yaki" }
    ]
  },
  {
    name: "Stone 14",
    village: "Iwagakure",
    image: "/images/teams/stone14.png",
    members: [
      { name: "Hatakino Nonso"},
      { name: "Asahira Shurei", leader: true },
      { name: "Tanirata Natsuni" }
    ]
  },
  {
    name: "Mist 7",
    village: "Kirigakure",
    image: "/images/teams/mist7.png",
    members: [
      { name: "Ichita Oriru"},
      { name: "Kurokite Kusu", leader: true },
      { name: "Igataki Yosaru" }
    ]
  },
  {
    name: "Mist 8",
    village: "Kirigakure",
    image: "/images/teams/mist8.png",
    members: [
      { name: "Suigetsu Seisuki"},
      { name: "Kurokite Tabe", leader: true },
      { name: "Matsumo Kora" }
    ]
  },
  {
    name: "Snow 1",
    village: "Yukigakure",
    image: "/images/teams/snow1.png",
    members: [
      { name: "Tsuto Fuyumi"},
      { name: "Tsuto Hairisa", leader: true },
      { name: "Tsuto Usaki" }
    ]
  },
  {
    name: "Cloud 11",
    village: "Kumogakure",
    image: "/images/teams/cloud11.png",
    members: [
      { name: "Ju"},
      { name: "Ke", leader: true },
      { name: "Ru" }
    ]
  }
  // Add all 16 teams with their respective image paths...
];

function TeamViewer() {
  const [currentTeam, setCurrentTeam] = useState(0);

  const nextTeam = () => {
    setCurrentTeam((prev) => (prev + 1) % teams.length);
  };

  const prevTeam = () => {
    setCurrentTeam((prev) => (prev - 1 + teams.length) % teams.length);
  };

  const team = teams[currentTeam];

  return (
    <div className="team-viewer">
      <img src={team.image} alt={team.name} className="team-viewer-image" />
      <div className="team-counter">{currentTeam + 1} / {teams.length}</div>
      <div className="team-header">
        <button onClick={prevTeam} className="nav-arrow" disabled={currentTeam === 0}>
          ←
        </button>
        
        <h3>{team.name}</h3>
        
        <button onClick={nextTeam} className="nav-arrow" disabled={currentTeam === teams.length - 1}>
          →
        </button>
      </div>
      
      <div className="team-info">
        <div className="team-members">
          {team.members.map((member, idx) => (
            <div key={idx} className="team-member">
              <span className={member.leader ? "member-name leader" : "member-name"}>
                {member.name}
              </span>
              {member.role && <span className="member-role"> ({member.role})</span>}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default TeamViewer;