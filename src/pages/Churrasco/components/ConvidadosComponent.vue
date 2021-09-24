<template>
  <v-card>
    <v-toolbar color="primary" dark>Convidados</v-toolbar>
    <v-card-text>
      <v-data-table :headers="headers" :items="convidados" class="elevation-1">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Convidados</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Novo Convidado
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="editedItem.nome"
                          label="Nome"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-select
                          v-model="editedItem.opcao"
                          :items="opcoes"
                          label="Contribuição"
                          item-text="descricao"
                          return-object
                          chips
                        >
                          <template slot="selection" slot-scope="{ item }">
                            {{ item.descricao }} (R$ {{ formatPrice(item.valor) }})
                          </template>
                          <template slot="item" slot-scope="{ item }">
                            {{ item.descricao }} (R$ {{ formatPrice(item.valor) }})
                          </template>
                        </v-select>
                      </v-col>

                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.valorContribuicao"
                          label="Valor Pago"
                        ></v-text-field>
                      </v-col>

                      <v-col cols="12" sm="6" md="4"> </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancel
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >Tem certeza que deseja excluir este convidado?</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancel</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >OK</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:item.quitado="{ item }">
          {{ quitado(item) }}
        </template>
        <template v-slot:item.opcao="{ item }">
          {{ montaDescricao(item) }}
        </template>
        <template v-slot:item.valorContribuicao="{ item }">
          R$ {{ formatPrice(item.valorContribuicao) }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Nome",
        align: "start",
        sortable: false,
        value: "nome",
      },
      { text: "Opção de contribuição", value: "opcao" },
      { text: "Valor Pago", value: "valorContribuicao" },
      { text: "Quitado?", value: "quitado" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    opcoes: [],
    convidados: [],
    editedIndex: -1,
    editedItem: {
      nome: "",
      valorContribuicao: 0,
      idOpcao: null,
      opcao: {},
      churrasco: null,
    },
    defaultItem: {
      nome: "",
      valorContribuicao: 0,
      opcao: {},
    },
  }),

  props: {
    items: {
      type: null,
      required: false,
    },
    idChurrasco: {
      required: true,
    },
    itemsOpcoes: {
      type: null,
      required: true,
    },
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Adicionar Convidado"
        : "Editar Convidado";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    "editedItem.opcao"(val) {
      if (val) this.editedItem.idOpcao = val.id;
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    items(val) {
      this.convidados = val;
    },
    itemsOpcoes() {
      this.opcoes = this.itemsOpcoes;
    },
  },

  methods: {
    editItem(item) {
      this.editedIndex = this.convidados.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.convidados.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.delete();
    },
    montaDescricao(item) {
      if (item.opcao) {
        return `${item.opcao.descricao} (R$ ${this.formatPrice(item.opcao.valor)})`;
      }
    },
    quitado(item) {
      if (item.opcao) {
        if (item.opcao.valor > item.valorContribuicao) {
          return "Não";
        } else {
          return "Sim";
        }
      } else {
        return "Não";
      }
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    update() {
      let self = this;
      this.$http
        .put(
          `churrascos/${this.editedItem.idChurrasco}/convidados/${this.editedItem.id}`,
          this.$qs.stringify(this.editedItem)
        )
        .then(
          (response) => {
            self.$toast.success(
              response.data
                ? response.data
                : "Convidado atualizado com sucesso!"
            );

            //self.$router.push({ name: "churrascos" });
            Object.assign(self.convidados[self.editedIndex], self.editedItem);
            this.close();
          },
          (error) => {
            let messageError = "";
            if (error.response) {
              if (Array.isArray(error.response.data)) {
                error.response.data.forEach((element) => {
                  messageError += element.errorMessage;
                });
              } else {
                messageError = error.response.data;
              }
            } else {
              messageError =
                "Não foi possível atializar o convidado, tente mais tarde.";
            }
            this.$toast.error(messageError);
          }
        );
    },

    insert() {
      let self = this;
      this.$http
        .post(
          `churrascos/${this.idChurrasco}/convidados`,
          this.$qs.stringify(this.editedItem)
        )
        .then(
          (response) => {
            self.$toast.success(
              response.data ? response.data : "Convidado criado com sucesso!"
            );
            this.convidados.push(this.editedItem);
            this.close();
          },
          (error) => {
            let messageError = "";
            if (error.response) {
              if (Array.isArray(error.response.data)) {
                error.response.data.forEach((element) => {
                  messageError += element.errorMessage;
                });
              } else {
                messageError = error.response.data;
              }
            } else {
              messageError =
                "Não foi possível criar o convidado, tente mais tarde.";
            }
            this.$toast.error(messageError);
          }
        );
    },

    delete() {
      let self = this;
      this.$http
        .delete(
          `churrascos/${this.editedItem.idChurrasco}/convidados/${this.editedItem.id}`
        )
        .then(
          (response) => {
            self.$toast.success(
              response.data ? response.data : "Convidado ecluído com sucesso!"
            );

            //self.$router.push({ name: "churrascos" });
            this.convidados.splice(this.editedIndex, 1);
            this.closeDelete();
          },
          (error) => {
            let messageError = "";
            if (error.response) {
              if (Array.isArray(error.response.data)) {
                error.response.data.forEach((element) => {
                  messageError += element.errorMessage;
                });
              } else {
                messageError = error.response.data;
              }
            } else {
              messageError =
                "Não foi possível excluir o convidado, tente mais tarde.";
            }
            this.$toast.error(messageError);
          }
        );
    },

    async save() {
      if (this.editedIndex > -1) {
        await this.update();
      } else {
        this.insert();
      }
    },
    formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
  },
};
</script>
