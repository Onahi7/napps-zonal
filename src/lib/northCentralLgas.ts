/**
 * Local Government Areas (LGAs) for North Central Zone States
 * Benue, Kogi, Kwara, Niger, Nasarawa, Plateau, FCT
 */

export const NORTH_CENTRAL_LGAS: Record<string, string[]> = {
  'Benue': [
    'Ado',
    'Agatu',
    'Apa',
    'Buruku',
    'Gboko',
    'Guma',
    'Gwer East',
    'Gwer West',
    'Katsina-Ala',
    'Konshisha',
    'Kwande',
    'Logo',
    'Makurdi',
    'Obi',
    'Ogbadibo',
    'Ohimini',
    'Oju',
    'Okpokwu',
    'Otukpo',
    'Tarka',
    'Ukum',
    'Ushongo',
    'Vandeikya'
  ],
  'Kogi': [
    'Adavi',
    'Ajaokuta',
    'Ankpa',
    'Bassa',
    'Dekina',
    'Ibaji',
    'Idah',
    'Igalamela-Odolu',
    'Ijumu',
    'Kabba/Bunu',
    'Kogi',
    'Lokoja',
    'Mopa-Muro',
    'Ofu',
    'Ogori/Magongo',
    'Okehi',
    'Okene',
    'Olamaboro',
    'Omala',
    'Yagba East',
    'Yagba West'
  ],
  'Kwara': [
    'Asa',
    'Baruten',
    'Edu',
    'Ekiti',
    'Ifelodun',
    'Ilorin East',
    'Ilorin West',
    'Irepodun',
    'Isin',
    'Kaiama',
    'Moro',
    'Offa',
    'Oke-Ero',
    'Oyun',
    'Pategi'
  ],
  'Niger': [
    'Agaie',
    'Agwara',
    'Bida',
    'Borgu',
    'Bosso',
    'Chanchaga',
    'Edati',
    'Gbako',
    'Gurara',
    'Katcha',
    'Kontagora',
    'Lapai',
    'Lavun',
    'Magama',
    'Mariga',
    'Mashegu',
    'Mokwa',
    'Moya',
    'Paikoro',
    'Rafi',
    'Rijau',
    'Shiroro',
    'Suleja',
    'Tafa',
    'Wushishi'
  ],
  'Nasarawa': [
    'Akwanga',
    'Awe',
    'Doma',
    'Karu',
    'Keana',
    'Keffi',
    'Kokona',
    'Lafia',
    'Nasarawa',
    'Nasarawa Egon',
    'Obi',
    'Toto',
    'Wamba'
  ],
  'Plateau': [
    'Barkin Ladi',
    'Bassa',
    'Bokkos',
    'Jos East',
    'Jos North',
    'Jos South',
    'Kanam',
    'Kanke',
    'Langtang North',
    'Langtang South',
    'Mangu',
    'Mikang',
    'Pankshin',
    'Qua\'an Pan',
    'Riyom',
    'Shendam',
    'Wase'
  ],
  'FCT': [
    'Abaji',
    'Bwari',
    'Gwagwalada',
    'Kuje',
    'Kwali',
    'Municipal Area Council (Maiduguri)'
  ]
};

export type NorthCentralLga = string;

export function getLgasForState(state: string): string[] {
  return NORTH_CENTRAL_LGAS[state] || [];
}

export function isValidLga(state: string, lga: string): boolean {
  const lgas = getLgasForState(state);
  return lgas.includes(lga);
}
