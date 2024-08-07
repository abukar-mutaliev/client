const uuid = require("uuid");
const ApiError = require("../error/ApiError");
const PersonNetworks = require("../models/PersonNetwork");
const Person = require("../models/Person.model");
const Network = require("../models/Network.model");
const AdPrice = require("../models/AdPrice.model");

class PersonController {
  async createPerson(req, res, next) {
    const {
      person_name,
      person_description,
      activity,
      achievements,
      regionRegionId,
      categoryCategoryId,
      networks,
      ad_prices,
      pinned,
    } = req.body;

    let uploadPath;
    try {
      if (req.files && req.files.image) {
        const img = req.files.image;
        uploadPath = `./image/${uuid.v4()}.jpg`;
        await img.mv(uploadPath);
      } else {
        return res.status(400).json("Изображение не загружено");
      }

      const newPerson = await Person.create({
        person_name,
        person_description,
        activity,
        achievements,
        regionRegionId,
        categoryCategoryId,
        pinned,
        person_photo: uploadPath,
      });

      const networkArray = JSON.parse(networks);
      await Promise.all(
        networkArray.map(async ({ network_name, followers, network_link }) => {
          if (!network_name || !followers || !network_link) {
            console.warn(
              `Некорректные данные для сети: network_name=${network_name}, followers=${followers}, network_link=${network_link}`
            );
            return;
          }
          let network = await Network.findOne({
            where: { network_name },
          });
          if (!network) {
            network = await Network.create({ network_name });
          }
          if (!network) {
            console.warn(`Соцсеть с именем ${network_name} не найдена`);
            return;
          }
          const adPriceData = JSON.parse(ad_prices);

          await AdPrice.create({
            personId: newPerson.person_id,
            ...adPriceData,
          });

          await PersonNetworks.create({
            personPersonId: newPerson.person_id,
            networkNetworkId: network.network_id,
            followers,
            network_name,
            network_link,
          });
        })
      );

      const createdPersonWithNetworks = await Person.findByPk(
        newPerson.person_id,
        {
          include: [Network, AdPrice],
        }
      );

      return res.json({
        message: "Пользователь с соцсетями создан",
        person: createdPersonWithNetworks,
      });
    } catch (error) {
      console.error("Ошибка при создании пользователя с сетями:", error);
      return next(ApiError.internal("Внутренняя ошибка сервера"));
    }
  }

  async pinnedPerson(req, res) {
    const { id } = req.params;
    try {
      const person = await Person.findByPk(id);
      if (person) {
        person.pinned = !person.pinned;
        await person.save();
        res.status(200).send({ message: "Person pin status updated." });
      } else {
        res.status(404).send({ message: "Person not found." });
      }
    } catch (error) {
      res.status(500).send({ message: "An error occurred.", error });
    }
  }

  async getPersons(req, res, next) {
    try {
      const persons = await Person.findAll({
        include: [
          {
            model: Network,
            through: {
              attributes: ["followers", "network_name", "network_link"],
            },
          },
          {
            model: AdPrice,
          },
        ],
      });
      return res.json(persons);
    } catch (error) {
      console.error("Error fetching persons:", error);
      return next(ApiError.badRequest("Ошибка загрузки пользователя"));
    }
  }

  async getPersonNetworks(req, res) {
    try {
      const personId = req.params.id;
      const person = await Person.findByPk(personId, {
        include: [
          {
            model: Network,
            through: { attributes: [] },
          },
          {
            model: AdPrice,
          },
        ],
      });

      if (!person) {
        return res.status(404).json({ error: "Person not found" });
      }

      res.json({
        networks: person.Networks,
        ad_prices: person.AdPrice,
      });
    } catch (error) {
      console.error("Error fetching person networks and ad prices:", error);
      res.status(500).json({ error: "Server error" });
    }
  }

  async getOnePerson(req, res, next) {
    const person_id = req.params.id;
    try {
      const person = await Person.findByPk(person_id, {
        include: [
          {
            model: Network,
            through: {
              attributes: ["followers", "network_name", "network_link"],
            },
          },
          {
            model: AdPrice,
          },
        ],
      });
      if (person) {
        return res.json(person);
      }
      return res.status(404).json({ error: "Пользователь не найден" });
    } catch (error) {
      console.error("Error fetching person:", error);
      return next(ApiError.badRequest("Ошибка загрузки пользователя"));
    }
  }

  async updatePerson(req, res, next) {
    const person_id = req.params.id;
    const {
      person_name,
      person_description,
      activity,
      achievements,
      regionRegionId,
      categoryCategoryId,
      networks,
      ad_prices,
      pinned,
    } = req.body;
    let uploadPath;
    try {
      if (req.files && req.files.image) {
        const img = req.files.image;
        uploadPath = `./image/${uuid.v4()}.jpg`;
        await img.mv(uploadPath);
      }

      const existingPerson = await Person.findByPk(person_id);
      if (!existingPerson) {
        return res.status(404).json({ error: "Пользователь не найден" });
      }
      existingPerson.person_name = person_name;
      existingPerson.pinned = pinned;
      existingPerson.person_description = person_description;
      existingPerson.activity = activity;
      existingPerson.achievements = achievements;
      existingPerson.regionRegionId = regionRegionId;
      existingPerson.categoryCategoryId = categoryCategoryId;
      if (uploadPath) {
        existingPerson.person_photo = uploadPath;
      }
      await existingPerson.save();

      if (networks) {
        try {
          const networkData = JSON.parse(networks);

          await Promise.all(
            networkData.map(
              async ({ network_id, followers, network_name, network_link }) => {
                if (!network_id) {
                  console.warn(
                    "network_id is undefined. Skipping this network."
                  );
                  return;
                }

                let network = await Network.findByPk(network_id);

                if (!network) {
                  console.warn(
                    `Соцсеть с id ${network_id} не найдена, создаем новую.`
                  );
                  network = await Network.create({
                    network_name,
                  });
                }

                let personNetwork = await PersonNetworks.findOne({
                  where: {
                    personPersonId: existingPerson.person_id,
                    networkNetworkId: network_id,
                  },
                });

                if (!personNetwork) {
                  personNetwork = await PersonNetworks.create({
                    personPersonId: existingPerson.person_id,
                    networkNetworkId: network_id,
                    followers,
                    network_name,
                    network_link,
                  });
                } else {
                  personNetwork.followers = followers;
                  personNetwork.network_name = network_name;
                  personNetwork.network_link = network_link;
                  await personNetwork.save();
                }
              }
            )
          );
        } catch (jsonError) {
          console.error("Error parsing networks JSON:", jsonError);
          return res
            .status(400)
            .json({ error: "Invalid networks JSON format" });
        }
      }
      if (ad_prices) {
        try {
          const adPriceData = JSON.parse(ad_prices);

          let adPrice = await AdPrice.findOne({
            where: { personId: existingPerson.person_id },
          });

          if (!adPrice) {
            adPrice = await AdPrice.create({
              personId: existingPerson.person_id,
              ...adPriceData,
            });
          } else {
            adPrice.instagram_joint_reel = adPriceData.instagram_joint_reel;
            adPrice.instagram_story = adPriceData.instagram_story;
            adPrice.instagram_story_repost = adPriceData.instagram_story_repost;
            adPrice.instagram_post = adPriceData.instagram_post;
            adPrice.video_integration = adPriceData.video_integration;
            adPrice.vk_post = adPriceData.vk_post;
            adPrice.telegram_post = adPriceData.telegram_post;
            adPrice.youtube_standard_integration =
              adPriceData.youtube_standard_integration;
            adPrice.video_greeting = adPriceData.video_greeting;
            await adPrice.save();
          }
        } catch (jsonError) {
          console.error("Error parsing ad_prices JSON:", jsonError);
          return res
            .status(400)
            .json({ error: "Invalid ad_prices JSON format" });
        }
      }

      return res.json({
        message: "Пользователь, соцсети и рекламные цены обновлены",
        person: existingPerson,
      });
    } catch (error) {
      console.error(
        "Error updating person with networks and ad prices:",
        error
      );
      return next(ApiError.internal("Internal server error"));
    }
  }

  async deleteUser(req, res, next) {
    try {
      const personId = req.params.id;

      if (!personId || isNaN(personId)) {
        return res.json("Неправильный person_id");
      }

      const deletedUser = await Person.destroy({
        where: {
          person_id: personId,
        },
      });

      if (deletedUser === 0) {
        return res.json("Пользователь не найден");
      }

      res.json({ message: "Пользователь успешно удален" });
    } catch (error) {
      console.error(error);
      return next(ApiError.internal(`Ошибка сервера: ${error}`));
    }
  }
}

module.exports = new PersonController();
