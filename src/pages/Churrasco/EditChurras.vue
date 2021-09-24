<template>
  <v-row>
    <v-col cols="12" sm="8" md="8">
      <v-card>
      <v-toolbar color="primary" dark>Informações do Churras</v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="12">
            <v-text-field
              v-model="churrasco.descricao"
              maxlength="100"
              :error-messages="descricaoErrors"
              counter="100"
              label="Descrição"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="12">
            <v-textarea
              v-model="churrasco.observacoes"
              maxlength="500"
              counter="500"
              label="Observações"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-menu
              v-model="menuData"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="dateText"
                  label="Data"
                  prepend-icon="mdi-calendar"
                  :error-messages="dataErrors"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="churrasco.data"
                type="date"
                locale="pt-br"
                :min="nowDate"
                @input="menuData = false"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="6" sm="12" md="6">
            <v-menu
              ref="menuHorario"
              v-model="menuHorario"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="churrasco.horario"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="churrasco.horario"
                  label="Horário"
                  prepend-icon="mdi-clock-time-four-outline"
                  :error-messages="horarioErrors"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menuHorario"
                v-model="churrasco.horario"
                full-width
                format="24hr"
                @click:minute="$refs.menuHorario.save(churrasco.horario)"
              ></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="update">Atualizar</v-btn>
        <v-btn color="error" class="ml-5" @click="dialogDelete = !dialogDelete">
          Excluir
        </v-btn>
      </v-card-actions>
    </v-card>
    </v-col>
 
    <v-col cols="12" sm="4" md="4">
      <OpcoesComponent
      :items="opcoes"
      v-on:update-opcoes="updateOpcoes"
      :idChurrasco="churrasco.id"
      :updateDatabase="true"
      class="mb-5"
    />
    
    </v-col>

       <v-col cols="12" sm="12" md="12">
      <ConvidadosComponent
      :items="convidados"
      :idChurrasco="churrasco.id"
      :itemsOpcoes="opcoes"
      class="mb-5"
    />
    </v-col>
    
    

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5"
          >Tem certeza que deseja excluir o Churras?</v-card-title
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm"
            >OK</v-btn
          >
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import OpcoesComponent from "./components/OpcoesComponent.vue";
import ConvidadosComponent from "./components/ConvidadosComponent.vue";
export default {
  mixins: [validationMixin],
  validations: {
    churrasco: {
      descricao: { required },
      data: { required },
      horario: { required },
    },
  },
  components: {
    OpcoesComponent,
    ConvidadosComponent,
  },
  props: {
    id: {
      required: true,
    },
  },

  data() {
    return {
      e1: 1,
      convidados: null,
      opcoes: [],
      dataComHora: null,
      dateText: null,
      menuData: false,
      dialogDelete: false,
      menuHorario: false,
      nowDate: new Date().toISOString().slice(0, 10),
      churrasco: {
        id: null,
        data: null,
        descricao: "",
        observacoes: "",
        horario: null,
        convidados: null,
        opcoes: null,
      },
    };
  },
  watch: {
    "churrasco.data"(val) {
      this.dateText = this.moment(val).format("DD/MM/YYYY");
    },
    "churrasco.horario"(val) {
      this.churrasco.data = this.moment(this.churrasco.data)
        .startOf("day")
        .add(val)
        .format("YYYY-MM-DD HH:mm");
    },

    "churrasco.convidados"(val) {
      this.convidados = val;
    },
    "churrasco.opcoes"(val) {
      this.opcoes = val;
    },
  },
  async mounted() {
    await this.loadChurras();
  },
  methods: {
    validaCampos() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return false;
      } else {
        return true;
      }
    },
    updateOpcoes(val) {
      this.churrasco.opcoes = val;
    },

    delete() {
      let self = this;
      this.$http.delete(`churrascos/${this.churrasco.id}`).then(
        (response) => {
          self.$toast.success(
            response.data ? response.data : "Churrasco exluído com sucesso!"
          );
          self.$router.push({ name: "churrascos" });
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
              "Não foi possível excluir a Opção, tente mais tarde.";
          }
          this.$toast.error(messageError);
        }
      );
      this.closeDelete();
    },

    update() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      this.$http
        .put(
          `churrascos/${this.churrasco.id}`,
          this.$qs.stringify(this.churrasco)
        )
        .then(
          (response) => {
            this.$toast.success(
              response.data
                ? response.data
                : "Churrasco atualizado com sucesso!"
            );
            //self.$router.push({ name: "churrascos" });
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
                "Não foi possível criar o churrasco, tente mais tarde.";
            }
            this.$toast.error(messageError);
          }
        );
    },
    deleteItemConfirm() {
      this.delete();
    },

    closeDelete() {
      this.dialogDelete = false;
    },
    loadChurras: function() {
      let self = this;
      this.$http
        .get("churrascos/" + self.id)
        .then(function(response) {
          self.churrasco.id = response.data.id;
          self.churrasco.descricao = response.data.descricao;
          self.churrasco.observacoes = response.data.observacoes;
          self.churrasco.opcoes = response.data.opcoes;
          self.churrasco.convidados = response.data.convidados;


       

          self.churrasco.horario = self
            .moment(response.data.data)
            .format("HH:mm");
          self.churrasco.data = self
            .moment(response.data.data)
            .format("YYYY-MM-DD");

          console.log("Load Churrasco", self.churrasco);
          console.log("Churrasco Carregado", self.churrascoCarregado);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
  },
  computed: {
    horarioErrors() {
      const errors = [];

      if (!this.$v.churrasco.horario.$dirty) return errors;
      !this.$v.churrasco.horario.required &&
        errors.push("É necessário selecionar um horário.");
      return errors;
    },
    churrascoCarregado() {
      return this.churrasco.id > 0 ? true : false;
    },

    dataErrors() {
      const errors = [];

      if (!this.$v.churrasco.data.$dirty) return errors;
      !this.$v.churrasco.data.required &&
        errors.push("É necessário selecionar uma data.");
      return errors;
    },
    descricaoErrors() {
      const errors = [];

      if (!this.$v.churrasco.descricao.$dirty) return errors;
      !this.$v.churrasco.descricao.required &&
        errors.push("A descricao é obrigatória");
      return errors;
    },
  },
};
</script>
