import {StructureBuilder} from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Conflict Wire Studio')
    .items([
      // Custom Region Structure
      S.listItem()
        .title('Region Management')
        .child(
          S.list()
            .title('Regions')
            .items([
              // 1. Continents List
              S.listItem()
                .title('Continents')
                .schemaType('continent')
                .child(S.documentTypeList('continent').title('Continents')),
              
              // 2. Countries List
              S.listItem()
                .title('All Countries')
                .schemaType('country')
                .child(S.documentTypeList('country').title('All Countries')),

              S.divider(),

              // 3. Hierarchical View (Countries by Continent)
              S.listItem()
                .title('Countries by Continent')
                .child(
                  S.documentTypeList('continent')
                    .title('Select Continent')
                    .child((continentId) =>
                      S.documentList()
                        .title('Countries')
                        .filter('_type == "country" && continent._ref == $continentId')
                        .params({continentId})
                    )
                ),
            ])
        ),

      S.divider(),

      // List all other document types, excluding the ones we just manually grouped
      ...S.documentTypeListItems().filter(
        (listItem) => !['continent', 'country', 'region'].includes(listItem.getId() as string)
      ),
    ])
