// Script to populate continents and countries (conflict areas focus)
// Run with: npm run populate-regions

import {createClient} from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'meyoc37a',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Continent and country data focused on conflict/geopolitical regions
const regionsData = [
  {
    continent: {
      title: 'Africa',
      slug: 'africa',
    },
    countries: [
      'Sudan',
      'South Sudan',
      'Somalia',
      'Ethiopia',
      'Eritrea',
      'Democratic Republic of Congo',
      'Central African Republic',
      'Mali',
      'Burkina Faso',
      'Niger',
      'Nigeria',
      'Cameroon',
      'Chad',
      'Libya',
      'Egypt',
      'Tunisia',
      'Algeria',
      'Morocco',
      'Western Sahara',
      'Kenya',
      'Uganda',
      'Rwanda',
      'Burundi',
      'Mozambique',
      'Zimbabwe',
      'South Africa',
    ],
  },
  {
    continent: {
      title: 'Asia',
      slug: 'asia',
    },
    countries: [
      'Myanmar',
      'Afghanistan',
      'Pakistan',
      'India',
      'Bangladesh',
      'Sri Lanka',
      'Nepal',
      'Bhutan',
      'China',
      'Taiwan',
      'North Korea',
      'South Korea',
      'Japan',
      'Philippines',
      'Indonesia',
      'Malaysia',
      'Thailand',
      'Vietnam',
      'Cambodia',
      'Laos',
      'Singapore',
      'Brunei',
      'East Timor',
      'Papua New Guinea',
      'Mongolia',
      'Kazakhstan',
      'Uzbekistan',
      'Turkmenistan',
      'Kyrgyzstan',
      'Tajikistan',
    ],
  },
  {
    continent: {
      title: 'Middle East',
      slug: 'middle-east',
    },
    countries: [
      'Palestine',
      'Israel',
      'Lebanon',
      'Syria',
      'Iraq',
      'Iran',
      'Jordan',
      'Saudi Arabia',
      'Yemen',
      'Oman',
      'United Arab Emirates',
      'Qatar',
      'Bahrain',
      'Kuwait',
      'Turkey',
      'Cyprus',
      'Armenia',
      'Azerbaijan',
      'Georgia',
    ],
  },
  {
    continent: {
      title: 'Europe',
      slug: 'europe',
    },
    countries: [
      'Ukraine',
      'Russia',
      'Belarus',
      'Moldova',
      'Poland',
      'Germany',
      'France',
      'United Kingdom',
      'Spain',
      'Italy',
      'Greece',
      'Serbia',
      'Bosnia and Herzegovina',
      'Croatia',
      'Slovenia',
      'North Macedonia',
      'Albania',
      'Kosovo',
      'Montenegro',
      'Romania',
      'Bulgaria',
      'Hungary',
      'Czech Republic',
      'Slovakia',
      'Austria',
      'Switzerland',
      'Netherlands',
      'Belgium',
      'Denmark',
      'Norway',
      'Sweden',
      'Finland',
      'Estonia',
      'Latvia',
      'Lithuania',
      'Portugal',
      'Ireland',
    ],
  },
  {
    continent: {
      title: 'Americas',
      slug: 'americas',
    },
    countries: [
      'United States',
      'Canada',
      'Mexico',
      'Guatemala',
      'Honduras',
      'El Salvador',
      'Nicaragua',
      'Costa Rica',
      'Panama',
      'Colombia',
      'Venezuela',
      'Ecuador',
      'Peru',
      'Brazil',
      'Bolivia',
      'Paraguay',
      'Chile',
      'Argentina',
      'Uruguay',
      'Guyana',
      'Suriname',
      'French Guiana',
      'Haiti',
      'Dominican Republic',
      'Cuba',
      'Jamaica',
      'Trinidad and Tobago',
    ],
  },
  {
    continent: {
      title: 'Oceania',
      slug: 'oceania',
    },
    countries: [
      'Australia',
      'New Zealand',
      'Fiji',
      'Solomon Islands',
      'Vanuatu',
      'Samoa',
      'Tonga',
      'Kiribati',
      'Micronesia',
      'Marshall Islands',
      'Palau',
      'Nauru',
      'Tuvalu',
    ],
  },
]

async function createSlug(text: string): Promise<string> {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function populateRegions() {
  console.log('🌍 Starting to populate continents and countries...\n')

  try {
    for (const regionData of regionsData) {
      console.log(`📍 Creating continent: ${regionData.continent.title}`)

      // Create continent
      const continentSlug = await createSlug(regionData.continent.title)
      const continent = await client.create({
        _type: 'continent',
        title: regionData.continent.title,
        slug: {
          _type: 'slug',
          current: continentSlug,
        },
      })

      console.log(`   ✅ Created: ${continent.title} (${continent._id})`)
      console.log(`   📝 Creating ${regionData.countries.length} countries...\n`)

      // Create countries for this continent
      const countryPromises = regionData.countries.map(async (countryName) => {
        const countrySlug = await createSlug(countryName)

        try {
          const country = await client.create({
            _type: 'country',
            title: countryName,
            slug: {
              _type: 'slug',
              current: countrySlug,
            },
            continent: {
              _type: 'reference',
              _ref: continent._id,
            },
          })
          console.log(`      ✓ ${country.title}`)
          return country
        } catch (error) {
          console.error(`      ✗ Failed to create ${countryName}:`, error)
          return null
        }
      })

      const countries = await Promise.all(countryPromises)
      const successfulCountries = countries.filter((c) => c !== null)

      console.log(`   ✅ Created ${successfulCountries.length}/${regionData.countries.length} countries\n`)

      // Update continent with country references
      const countryRefs = successfulCountries
        .filter((c) => c !== null)
        .map((c) => ({
          _type: 'reference',
          _ref: c!._id,
          _key: c!._id,
        }))

      await client
        .patch(continent._id)
        .set({countries: countryRefs})
        .commit()

      console.log(`   ✅ Updated ${continent.title} with country references\n`)
      console.log('─'.repeat(60) + '\n')
    }

    console.log('🎉 SUCCESS! All continents and countries created!\n')
    console.log('📊 Summary:')

    // Fetch and display summary
    const continents = await client.fetch(`*[_type == "continent"] | order(title asc)`)
    const countries = await client.fetch(`*[_type == "country"] | order(title asc)`)

    console.log(`   Total Continents: ${continents.length}`)
    console.log(`   Total Countries: ${countries.length}\n`)

    continents.forEach((continent: any) => {
      const continentCountries = countries.filter(
        (c: any) => c.continent._ref === continent._id
      )
      console.log(`   ${continent.title}: ${continentCountries.length} countries`)
    })

    console.log('\n✅ You can now view them at: https://conflictwire.sanity.studio/')

  } catch (error) {
    console.error('❌ Error populating regions:', error)
    throw error
  }
}

populateRegions()
